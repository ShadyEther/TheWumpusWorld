import random as rand
import os


class Game_Mech:
    def __init__(self) -> None:
        self.rules={
            2: 'Glitter is seen',
            1: 'Stinky Smell'
        }


    def sense_env(self,board,size,player_pos):
        senses=[]
        env=[]
        if player_pos[0] !=0:
            env.append(board[player_pos[0]-1][player_pos[1]])
            
        if player_pos[0] !=size-1:
            env.append(board[player_pos[0]+1][player_pos[1]])

        if player_pos[1] !=0:
            env.append(board[player_pos[0]][player_pos[1]-1])

        if player_pos[1] !=size-1:
            env.append(board[player_pos[0]][player_pos[1]+1])

        for stuff in env:
            if stuff in self.rules:
                senses.append(self.rules[stuff])

        return senses

    def check_status(self,player_pos,board):
        if board[player_pos[0]][player_pos[1]]==2:
            print("You found the gold!..")
            exit()
        elif board[player_pos[0]][player_pos[1]]==1:
            print("No... You were killed by a wumpus!")
            exit()

        
        

class Board(Game_Mech):
    def __init__(self) -> None:
        super().__init__()
        self.size=4
        self.board=[[0 for _ in range(self.size)]for _ in range(self.size)]


    def fill_board(self,wump_count):
        for count in range(wump_count):
            self.board[rand.randint(0,self.size-1)][rand.randint(0,self.size-1)]=1
        self.board[rand.randint(0,self.size-1)][rand.randint(0,self.size-1)]=2

    def display_board(self,player_pos):
        for i in range(self.size):
            for j in range(self.size):
                if i == player_pos[0] and j==player_pos[1]:
                    print(' P ',end="")
                else:
                    print(f" {self.board[i][j]} ",end="")
            print()

class Player(Board):
    def __init__(self) -> None:
        super().__init__()
        super().fill_board(3)
        self.score=0
        self.curr_pos=[0,0]
        self.sense=[]


    def move_right(self):
        if self.curr_pos[1]==self.size-1:
            print("Edge Reached")
        else:
            self.curr_pos[1]+=1

    def move_left(self):
        if self.curr_pos[1]==0:
            print("Edge Reached")
        else:
            self.curr_pos[1]-=1

    def move_top(self):
        if self.curr_pos[0]==0:
            print("Edge Reached")
        else:
            self.curr_pos[0]-=1

    def move_down(self):
        if self.curr_pos[0]==self.size-1:
            print("Edge Reached")
        else:
            self.curr_pos[0]+=1
            
    def control(self,key):
        if key=='w':
            self.move_top()
        elif key=='a':
            self.move_left()
        elif key=='s':
            self.move_down()
        elif key=='d':
            self.move_right()
        
    def update_sense(self):
        self.sense=self.sense_env(self.board,self.size,self.curr_pos)

    def display_sense(self):
        if self.sense:
            for sense in self.sense:
                print(sense)
        else:
            print('Nothing sensed here')

player1=Player()



while(1):
    player1.display_board(player1.curr_pos)
    player1.check_status(player1.curr_pos,player1.board)
    player1.update_sense()
    player1.display_sense()
    key=input()
    player1.control(key)
    os.system('cls')







