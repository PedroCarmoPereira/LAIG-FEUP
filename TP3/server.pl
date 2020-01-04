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
		processString(Data, Reply),							% Call processing predicate
		format('Content-type: application/json~n~n'),		% Reply will be JSON
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
					  													(Pintou = 0 -> same(Player, NextPlayer), Message = "Funky Fredy"; (game_over(NewBoard, _Winner) -> same(Player, NextPlayer), gameOverMsg(NewBoard, TP, Message); next(Player, NextPlayer), Message = "Groovy Gary"))).

humanXboteasyaction(C, L, Board, NewBoard, blue0, NextPlayer, Message):- human1stMove(blue0, C, L, Board, TB, _, Message),
																		 (Message = "Groovy Gary" -> random1stMove(TB, ai1, red, NewBoard), NextPlayer = blue1; NextPlayer = blue0, NewBoard = Board).

humanXboteasyaction(C, L, Board, NewBoard, blue1, NextPlayer, Message):- move(play(blue, pos(C, L)), Board, NewBoard, Pintou),
																		 (Pintou = 0 -> same(blue1, NextPlayer), Message = "Funky Fredy"; (game_over(NewBoard, _Winner) -> same(blue1, NextPlayer), gameOverMsg(NewBoard, blue, Message); next(blue1, NextPlayer), Message = "Groovy Gary")).

humanXboteasyaction(C, L, Board, NewBoard, blue2, NextPlayer, Message):- move(play(blue, pos(C, L)), Board, TB, Pintou),
																		 (TB = Board -> NewBoard = Board; randomTurn(TB, red, NewBoard, 0)),
																		 (Pintou = 0 -> same(blue2, NextPlayer), Message = "Funky Fredy"; (game_over(NewBoard, _Winner) -> same(blue2, NextPlayer), gameOverMsg(NewBoard, blue, Message); prev(blue2, NextPlayer), Message = "Groovy Gary")).


humanXbothardaction(C, L, Board, NewBoard, blue0, NextPlayer, Message):- human1stMove(blue0, C, L, Board, TB, _, Message),
																		 (Message = "Groovy Gary" -> random1stMove(TB, ai1, red, NewBoard), NextPlayer = blue1; NextPlayer = blue0, NewBoard = Board).

humanXbothardaction(C, L, Board, NewBoard, blue1, NextPlayer, Message):- move(play(blue, pos(C, L)), Board, NewBoard, Pintou),
																		 (Pintou = 0 -> same(blue1, NextPlayer), Message = "Funky Fredy"; (game_over(NewBoard, _Winner) -> same(blue1, NextPlayer), gameOverMsg(NewBoard, blue, Message); next(blue1, NextPlayer), Message = "Groovy Gary")).

humanXbothardaction(C, L, Board, NewBoard, blue2, NextPlayer, Message):- move(play(blue, pos(C, L)), Board, TB, Pintou),
																		 (TB = Board -> NewBoard = Board; thoughtTurn(TB, red, NewBoard, 0)),
																		 (Pintou = 0 -> same(blue2, NextPlayer), Message = "Funky Fredy"; (game_over(NewBoard, _Winner) -> same(blue2, NextPlayer), gameOverMsg(NewBoard, blue, Message); prev(blue2, NextPlayer), Message = "Groovy Gary")).


bots1stturn(Board, NewBoard, Message):-random1stMove(Board, ai1, blue, NB), random1stMove(NB, ai1, red, NewBoard), Message = "Groovy Gary".

boteasyXboteasyaction(Board, NewBoard, blue0, blue1, Message):-  bots1stturn(Board, NewBoard, Message).

boteasyXboteasyaction(Board, NewBoard, _, NextPlayer, Message):- randomTurn(Board, blue, TB, 0), (game_over(TB, _Winner) -> NewBoard = TB, Message = "Game Over";randomTurn(TB, red, NewBoard, 0), (game_over(NewBoard, _Win2) -> Message = "Game Over"; Message = "Groovy Gary")), NextPlayer = "pc".
														
bothardXboteasyaction(Board, NewBoard, blue0, blue1, Message):- bots1stturn(Board, NewBoard, Message).

bothardXboteasyaction(Board, NewBoard, _, pc, Message):- thoughtTurn(Board, blue, TB, 0), (game_over(TB, _Winner) -> NewBoard = TB, Message = "Game Over";randomTurn(TB, red, NewBoard, 0), (game_over(NewBoard, _Win2) -> Message = "Game Over"; Message = "Groovy Gary")).

bothardXbothardaction(Board, NewBoard, blue0, blue1, Message):- bots1stturn(Board, NewBoard, Message).

bothardXbothardaction(Board, NewBoard, _, pc, Message):- thoughtTurn(Board, blue, TB, 0), (game_over(TB, _Winner) -> NewBoard = TB, Message = "Game Over";thoughtTurn(TB, red, NewBoard, 0), (game_over(NewBoard, _Win2) -> Message = "Game Over"; Message = "Groovy Gary")).


play(Player, Board, C, L, GameType, NextPlayer, NewBoard, Message):-		% Example play predicate aqui metemos a logica de jogo, que se divide em 3 logicas, humano X humano: isto processa uma move, se for a 2 moves por turno e troca; humano x pc como anterior, mas não troca, simplesmente manda as moves do pc, e pc x pc em que faz tudo?
	% Game Logic
	gameConfig(GameType, GT),
	(GT = humanXhuman -> humanXhumanaction(C, L, Board, NewBoard, Player, NextPlayer, Message);
	(GT = humanXboteasy -> humanXboteasyaction(C, L, Board, NewBoard, Player, NextPlayer, Message);
	(GT = humanXbothard -> humanXbothardaction(C, L, Board, NewBoard, Player, NextPlayer, Message);
	(GT = boteasyXboteasy -> boteasyXboteasyaction(Board, NewBoard, Player, NextPlayer, Message);
	(GT = bothardXboteasy -> bothardXboteasyaction(Board, NewBoard, Player, NextPlayer, Message);
	(GT = bothardXbothard -> bothardXbothardaction(Board, NewBoard, Player, NextPlayer, Message);
	Board = [H | T ], NewBoard = [ H | T], same(Player, NextPlayer), Message = "Naughty Neddy")))))).

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

loopPlayer(blue1, blue2).
loopPlayer(blue2, blue1).

gameOverMsg(Board, TP, Message):- ( game_over(Board, TP) -> 
								  (same(TP, red) -> Message = "Red Wins"; Message = "Blue Wins");
								  (same(TP, blue) -> Message = "Red Wins"; Message = "Blue Wins")
								  ).

gameConfig(0, humanXhuman).
gameConfig(1, humanXboteasy).
gameConfig(2, humanXbothard).
gameConfig(3, boteasyXboteasy).
gameConfig(4, bothardXboteasy).
gameConfig(5, bothardXbothard).

:- server(8083).