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
%Messages: Groovy Gary -> Good, Funky Fredy -> Invalid Pos, Crunky Charlie -> Not yet implemented

firstMove(blue0).
firstMove(red0).

human1stMove(Player, C, L, Board, NewBoard, NextPlayer, Message):- (Player = red0 -> 
																   (validRed1stMove(Board, C, L) ->
																    alterPos(C, L, Board, 2, [], NewBoard), next(Player, NextPlayer), Message = "Groovy Gary";
																    Board = [H | T ], NewBoard = [ H | T], same(Player, NextPlayer), Message = "Funky Fredy");
																   (validBlue1stMove(Board, C, L) ->
																   	alterPos(C, L, Board, 1, [], NewBoard), next(Player, NextPlayer), Message = "Groovy Gary";
																    Board = [H | T ], NewBoard = [ H | T], same(Player, NextPlayer), Message = "Funky Fredy")
																   ).

humanXhumanaction(C, L, Board, NewBoard, Player, NextPlayer, Message):- (firstMove(Player) -> human1stMove(Player, C, L, Board, NewBoard, NextPlayer, Message);
																		player(Player, TP), 
																		move(play(TP, pos(C, L)), Board, NewBoard, Pintou),
					  													(Pintou = 0 -> same(Player, NextPlayer), Message = "Funky Fredy"; next(Player, NextPlayer), Message = "Groovy Gary")).

play(Player, Board, C, L, GameType, NextPlayer, NewBoard, Message):-		% Example play predicate aqui metemos a logica de jogo, que se divide em 3 logicas, humano X humano: isto processa uma move, se for a 2 moves por turno e troca; humano x pc como anterior, mas não troca, simplesmente manda as moves do pc, e pc x pc em que faz tudo?
	% Game Logic
	gameConfig(GameType, GT),
	getSize(Board, Size),
	(GT = humanXhuman -> humanXhumanaction(C, L, Board, NewBoard, Player, NextPlayer, Message);
	Board = [H | T ], NewBoard = [ H | T], same(Player, NextPlayer), Message = "Crunky Charlie").

same(X, X).

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


gameConfig(0, humanXhuman).
gameConfig(1, humanXboteasy).
gameConfig(2, humanXbothard).
gameConfig(3, boteasyXboteasy).
gameConfig(4, bothardXboteasy).
gameConfig(5, bothardXbothard).

:- server(8083).