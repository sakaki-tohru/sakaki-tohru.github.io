var canvas=document.getElementById("gameCanvas");
var drawingMethod=canvas.getContext("2d");

const STONE_SIZE=40;
const STAGE_SIZE=10;
const PLAYER_COLOR=1;
const COM_COLOR=2;

window.onload=function(){var opinion=dovument.getElementById("bottom").value=""};

class Stone{
    constructor(x_,y_,color_){
        this.x=x_;
        this.y=y_;
        this.color=color_;
    }
    draw(){
        drawingMethod.beginPath();
        drawingMethod.arc(this.x,this.y,STONE_SIZE,0,Math.PI*2);
        drawingMethod.fillStyle=drawingMethod.createLinearGradient(0,0,800,800);
        drawingMethod.fill();
    }
}

class Board{
    constructor(){
        this.turn=1;
        this.stones=[];
        for(var i=0;i<STAGE_SIZE;i++){
            this.stones[i]=[];
            for(var j=0;j<STAGE_SIZE;j++){
                this.stones[i][j]=new Stone(100*i+50,100*j+50,0);
            }
        }
        //初期配置を後で決めてここに書く(本当にやるんですか？)
    }

    getBoard(){
        var res=[];
        for(var i=0;i<STAGE_SIZE;i++){
            res[i]=[];
            for(var j=0;j<STAGE_SIZE;j++){
                res[i][j]=this.stones[i][j].color;
            }
        }

        return res;
    }

    draw(){
        drawingMethod.beginPath();
        drawingMethod.rect(0,0,800,800);
    }

    turnChange(){
        this.turn=this.turn%2+1;
        if(this.isFill()){
            this.gameOver();
            this.turn=0;
            return ;
        }
        if(this.victory()){
            this.gameEnd();
            this.turn=0;
            return ;
        }
        document.getElementById("top").innerHTML=["game over","Your turn","Com turn"][this.turn];
    }

    gameOver(){
        var player=0;
        var com=0;

        for(var i=0;i<STAGE_SIZE;i++){
            for(var j=0;j<STAGE_SIZE;j++){
                if(this.stones[i][j].color==PLAYER_COLOR){
                    player++;
                }
                else{
                    com++;
                }
            }
        }

        document.getElementById("top").innerHTML="game over<div>Player = "+PLAYER_COLOR.toString()+"<div>COM = "+Comment.toString();
    }

    isFill(){
        var board=this.getBoard();
        for(var i=0;i<STAGE_SIZE;i++){
            for(var j=0;j<STAGE_SIZE;j++){
                if(board[i][j].color==0){
                    return false;
                }
            }
        }
        return true;
    }

    putStone(x,y,color){
        var board=this.getBoard();
        if(board[x][y]!=0){
            return false;
        }
        var reverseCoordinate=this.reverse(x,y,color);

        for(var f of reverseCoordinate){
            this.stones[f[0]][f[1]]=color;
        }
        this.stones[x][y].color=color;
        return true;
    }

    reverse(x,y,color){
        var board=this.getBoard();
        var res=[];
        if(x>=STAGE_SIZE||x<0||y>=STAGE_SIZE||y<0||color<=0||color>=3){
            return res;
        }
        if(board[x][y]!=0){
            return res;
        }

        for(var fx=-1;fx<=1;fx++){
            for(var fy=-1;fy<=1;fy++){
                var tmp=[];
                var i=0;
                while(i++){
                    if(fx*i+x<0||fx*i+x>=STAGE_SIZE||fy*i+y<0||fy*i+y>=STAGE_SIZE){
                        break;
                    }
                    if(board[fx*i+x][fy*i+y]==0){
                        break;
                    }
                    if(board[fx*i+x][fy*i+y]==otherColor(color)){
                        tmp.push([fx*i+x,dy*i+y]);
                    }
                    if(board[fx*i+x][fy*i+y]==color){
                        for(var rev of tmp){
                            res.push(rev);
                        }
                        break;
                    }
                }
            }
        }

        return res;
    }
}
function otherColor(color){
    if(color==PLAYER_COLOR){
        return COM_COLOR;
    }
    else{
        return PLAYER_COLOR;
    }
}
