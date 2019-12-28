:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_path)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_server_files)).


:- use_module(library(lists)).
:- consult('virusWars.pl').

:- http_handler(root(game), prepReplyStringToJSON, []).						% Predicate to handle requests on server/game (for Prolog Game Logic)
:- http_handler(pub(.), serve_files_in_directory(pub), [prefix]).			% Serve files in /pub as requested (for WebGL Game Interface)
http:location(pub, root(pub), []).											% Location of /pub alias on server
user:file_search_path(document_root, '.').									% Absolute location of HTTP server document root
user:file_search_path(pub, document_root(pub)).								% location of /pub in relation to document root

server(Port) :- http_server(http_dispatch, [port(Port)]).		% Start server on port Port

%Receive Request as String via POST
prepReplyStringToJSON(Request) :- 
		member(method(post), Request), !,						% if POST
        http_read_data(Request, Data, []),						% Retrieve POST Data
		processString(Data, Reply),								% Call processing predicate
		format('Content-type: application/json~n~n'),			% Reply will be JSON
		formatAsJSON(Reply).									% Send Reply as JSON

prepReplyStringToJSON(_Request) :-								% Fallback for non-POST Requests
		format('Content-type: text/plain~n~n'),					% Start preparing reply - reply type
		write('Can only handle POST Requests'),					% Standard Reply
		format('~n').											% End Reply

formatAsJSON(Reply):-
		write('{'),												% Start JSON Object
		Fields = [newPlayer, newBoard, message],				% Response Field Names, aqui tenho que por as vars que quero mandar para o servidor, algo como board, player, e alguma mensagem
		writeJSON(Fields, Reply).								% Format content as JSON 
		
writeJSON([Prop], [Val]):-
	write('"'), write(Prop),
	write('":"'), write(Val), write('"}').						% Last element
writeJSON([Prop|PT], [Val|VT]):-
	write('"'), write(Prop),
	write('":"'), write(Val), write('", '),						% Separator for next element
	writeJSON(PT, VT).

processString([_Par=Val], R):-
        term_string(List, Val),									% Convert Parameter String to Prolog List
		R = [_NB, _NP, _M],										% Variables for Response
		append(List, R, ListR),									% Add extra Vars to Request
		Term =.. ListR,											% Create Term from ListR
		Term.													% Call the Term

%---------------------------------------------

play(Player, Board, C, L, NextPlayer, NewBoard, Message):-		% Example play predicate aqui metemos a logica de jogo, que se divide em 3 logicas, humano X humano: isto processa uma move, se for a 2 moves por turno e troca; humano x pc como anterior, mas não troca, simplesmente manda as moves do pc, e pc x pc em que faz tudo?
	% Game Logic
	Board=[[_|A]|B], NewBoard=[[C + L|A]|B],	
	next(Player, NextPlayer),
	Message = "Groovy".
						% Example - changes [1,1] to Play
	%move(play(player(Player), C, L))
	%move(play(blue, pos(C, L)), Board, Board)
	/*
	move(play(player(Player), pos(C, L)), Board, NewBoard),
	(Board = NewBoard -> Message = "Groove Validated" ; next(Player, NextPlayer), Message = "Moove Validated").*/
								% Change Player
																% Add some message (Game Over / Invalid Move / ...)


next(blue0, red0).
next(red0, blue1).
next(blue1, blue2).
next(blue2, red1).
next(red1, red2).
next(red2, blue1).

prev(X, Y):- next(Y, X).

player(blue0, blue).
player(blue1, blue).
player(blue2, blue).


player(red0, red).
player(red1, red).
player(red2, red).


:- server(8083).