var canvas=document.getElementById("gameCanvas");
var drawingMethod=canvas.getContext("2d");

const CONNECT_NUM=5;
const STONE_SIZE=40;
const STAGE_SIZE=6;
const SQUARE_SIZE=100;
const PLAYER_COLOR=1;
const COM_COLOR=2;

window.onload=function(){var opinion=document.getElementById("bottom").value=""};

class Stone{
    constructor(x_,y_,color_){
        this.x=x_;
        this.y=y_;
        this.color=color_;
    }
    draw(){
        if(this.color==0){
            return;
        }
        drawingMethod.beginPath();
        if(this.color==1){
            drawingMethod.fillStyle = 'rgb(255,255,255)';
        }
        else if(this.color==2){
            drawingMethod.fillStyle = 'rgb(00,00,00)';
        }
        drawingMethod.arc(this.x,this.y,STONE_SIZE,0,Math.PI*2);
        drawingMethod.fill();
    }
}

class Board{
    constructor(){
        this.turn=1;
        this.stones=[];
        this.winner=0;
        for(var i=0;i<STAGE_SIZE;i++){
            this.stones[i]=[];
            for(var j=0;j<STAGE_SIZE;j++){
                this.stones[i][j]=new Stone(SQUARE_SIZE*i+SQUARE_SIZE/2,SQUARE_SIZE*j+SQUARE_SIZE/2,0);
            }
        }
        //初期配置をいい感じに決めてちょ
        for(var i=2; i<=3;i++){
            for(var j=2;j<=3;j++){
                this.stones[i][j].color=(i+j+1)%2+1;
            }
        }
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
        drawingMethod.fillStyle = 'rgb(00,100,70)';
        drawingMethod.fillRect(0,0,SQUARE_SIZE*STAGE_SIZE,SQUARE_SIZE*STAGE_SIZE);
        for(var i=0;i<STAGE_SIZE;i++){
            for(var j=0;j<STAGE_SIZE;j++){
                this.stones[i][j].draw();
            }
        }
        for(var i=0;i<=STAGE_SIZE;i++){
            drawingMethod.beginPath();
            drawingMethod.moveTo(0,i*SQUARE_SIZE);
            drawingMethod.lineTo(SQUARE_SIZE*STAGE_SIZE,i*SQUARE_SIZE);
            drawingMethod.stroke();
            drawingMethod.beginPath();
            drawingMethod.moveTo(i*SQUARE_SIZE,0);
            drawingMethod.lineTo(i*SQUARE_SIZE,SQUARE_SIZE*STAGE_SIZE);
            drawingMethod.stroke();
        }
    }

    turnChange(){
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
        this.turn=this.turn%2+1;
        document.getElementById("top").innerHTML=["game over","Your turn","Com turn"][this.turn];
    }
    victory(){
        var board=this.getBoard();
        var fx=[1,0,1,1];
        var fy=[0,1,1,-1];

        for(var i=0;i<STAGE_SIZE;i++){
            for(var j=0;j<STAGE_SIZE;j++){
                for(var a=0;a<4;a++){
                    var tmp=0;
                    var col=board[i][j];
                    for(var k=1;true;k++){
                        var x=fx[a]*k+i;
                        var y=fy[a]*k+j;
                        if(x<0||x>=STAGE_SIZE||y<0||y>=STAGE_SIZE){
                            break;
                        }
                        if(board[x][y]==0){
                            break;
                        }
                        if(board[x][y]==col){
                            tmp++;
                        }
                    }
                    for(var k=-1;true;k--){
                        var x=fx[a]*k+i;
                        var y=fy[a]*k+j;
                        if(x<0||x>=STAGE_SIZE||y<0||y>=STAGE_SIZE){
                            break;
                        }
                        if(board[x][y]==0){
                            break;
                        }
                        if(board[x][y]==col){
                            tmp++;
                        }
                    }
                    if(tmp>=CONNECT_NUM-1){
                        this.winner=col;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    gameEnd(){
        var res="game end!!<div>winner = ";
        if(this.winner==1){
            res=res+"you!";
        }
        else if(this.winner==2){
            res=res+"COM";
        }
        document.getElementById("top").innerHTML=res;
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
        var res="game over!<div>";
        if(player>com){
            res=res+"winner = you!";
        }
        else if(player<com){
            res=res+"winner = COM";
        }
        else{
            res=res+"引き分け！"
        }
        res=res+"<div>your score is "+player.toString()+"<div>COM score is = "+com.toString();
        document.getElementById("top").innerHTML=res;
    }

    isFill(){
        var board=this.getBoard();
        for(var i=0;i<STAGE_SIZE;i++){
            for(var j=0;j<STAGE_SIZE;j++){
                if(board[i][j]==0){
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
        if(reverseCoordinate.length>0){
            for(var f of reverseCoordinate){
                this.stones[f[0]][f[1]].color=color;
            }
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
                for(var i=1;true;i++){
                    if(fx*i+x<0||fx*i+x>=STAGE_SIZE||fy*i+y<0||fy*i+y>=STAGE_SIZE){
                        break;
                    }
                    if(board[fx*i+x][fy*i+y]==0){
                        break;
                    }
                    if(board[fx*i+x][fy*i+y]==otherColor(color)){
                        tmp.push([fx*i+x,fy*i+y]);
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

function Click(eve){
    var rect=eve.target.getBoundingClientRect();
    var x=eve.clientX-rect.left;
    var y=eve.clientY-rect.top;
    if(game.putStone(~~(x/SQUARE_SIZE),~~(y/SQUARE_SIZE),PLAYER_COLOR)){
        game.turnChange();
    }
    if(game.turn==COM_COLOR){
        com_action(game);
    }
}

//クソ雑魚AIやめてくださいちょっとｗ
function com_action(board){
    var max_score=0;
    var x=0,y=0;
    for(var i=0;i<STAGE_SIZE;i++){
        for(var j=0;j<STAGE_SIZE;j++){
            var tmp=board.reverse(i,j,COM_COLOR);
            if(tmp>=max_score){
                max_score=tmp;
                x=i;
                y=j;
            }
        }
    }
    board.putStone(x,y,COM_COLOR);
    board.turnChange();
}

var game=new Board();

function draw(){
    game.draw();
}

canvas.addEventListener('click',Click,false);
setInterval(draw,1);