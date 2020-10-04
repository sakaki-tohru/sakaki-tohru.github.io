var canvas=document.getElementById("gameCanvas");
var drawingMethod=canvas.getContext("2d");

const STAGE_SIZE_HEIGHT=35;
const STAGE_SIZE_WEIGHT=25;
const SQUARE_SIZE=25;
const STONE_SIZE=12;
const MAX_COLOR=3;

var score=0;

var dx=[-1,0,1,0];
var dy=[0,1,0,-1];

var countR=0;
var countG=0;
var countB=0;

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
            drawingMethod.fillStyle = 'rgb(255,0,0)';
        }
        else if(this.color==2){
            drawingMethod.fillStyle = 'rgb(0,255,0)';
        }
        else if(this.color==3){
            drawingMethod.fillStyle = 'rgb(0,0,255)';
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

        for(var i=0;i<STAGE_SIZE_HEIGHT;i++){
            this.stones[i]=[];
            for(var j=0;j<STAGE_SIZE_WEIGHT;j++){
                this.stones[i][j]=new Stone(SQUARE_SIZE*i+SQUARE_SIZE/2,SQUARE_SIZE*j+SQUARE_SIZE/2,0);
            }
        }
        for(var i=0;i<STAGE_SIZE_HEIGHT;i++){
            for(var j=0;j<STAGE_SIZE_WEIGHT;j++){
                this.stones[i][j].color=randomGenerator(1,4);
                if(this.stones[i][j].color==1){
                    countR++;
                }
                if(this.stones[i][j].color==2){
                    countG++;
                }
                if(this.stones[i][j].color==3){
                    countB++;
                }
            }
        }
        this.drawAlways();
        document.getElementById("top").innerHTML="your score is "+score+"<div> 赤:"+countR+" 緑:"+countG+" 青:"+countB;
    }

    getBoard(){
        var res=[];
        for(var i=0;i<STAGE_SIZE_HEIGHT;i++){
            res[i]=[];
            for(var j=0;j<STAGE_SIZE_WEIGHT;j++){
                res[i][j]=this.stones[i][j].color;
            }
        }

        return res;
    }
    drawAlways(){
        drawingMethod.beginPath();
        drawingMethod.fillStyle = 'rgb(175,220,255)';
        drawingMethod.fillRect(0,0,SQUARE_SIZE*STAGE_SIZE_HEIGHT,SQUARE_SIZE*STAGE_SIZE_WEIGHT);
        for(var i=0;i<=STAGE_SIZE_WEIGHT;i++){
            drawingMethod.beginPath();
            drawingMethod.moveTo(0,i*SQUARE_SIZE);
            drawingMethod.lineTo(SQUARE_SIZE*STAGE_SIZE_HEIGHT,i*SQUARE_SIZE);
            drawingMethod.stroke();
        }
        for(var i=0;i<=STAGE_SIZE_HEIGHT;i++){
            drawingMethod.beginPath();
            drawingMethod.moveTo(i*SQUARE_SIZE,0);
            drawingMethod.lineTo(i*SQUARE_SIZE,SQUARE_SIZE*STAGE_SIZE_WEIGHT);
            drawingMethod.stroke();
        }        
        for(var i=0;i<STAGE_SIZE_HEIGHT;i++){
            for(var j=0;j<STAGE_SIZE_WEIGHT;j++){
                this.stones[i][j].draw();
            }
        }
    }

    turnChange(){
        this.drawAlways();
        //ゲーム終了状態
        if(this.turn==0){
            return ;
        }
        //全て消した
        if(this.victory()){
            console.log("your win!");
            score+=100000;
            this.gameEnd();
            this.turn=0;
            return ;
        }        
        //消せるものがない
        if(this.isNotErase()){
            console.log("your lose!");
            this.gameOver();
            this.turn=0;
            return ;
        }
        document.getElementById("top").innerHTML="your score is "+score+"<div> 赤:"+countR+" 緑:"+countG+" 青:"+countB;
    }
    victory(){
        for(var i=0;i<STAGE_SIZE_HEIGHT;i++){
            for(var j=0;j<STAGE_SIZE_WEIGHT;j++){
                if(this.stones[i][j].color!=0){
                    return false;
                }
            }
        }
        return true;
    }

    gameEnd(){
        document.getElementById("top").innerHTML="Great!!<div>your final score is "+score;
    }

    gameOver(){
        var res="game over!<div>";
        res=res+"<div>your score is "+score.toString();
        document.getElementById("top").innerHTML=res+"<div> 赤:"+countR+" 緑:"+countG+" 青:"+countB;;
    }

    isNotErase(){
        var board=this.getBoard();
        for(var i=0;i<STAGE_SIZE_HEIGHT;i++){
            for(var j=0;j<STAGE_SIZE_WEIGHT;j++){
                if(board[i][j]==0){continue;}
                for(var k=0;k<4;k++){
                    var nx=i+dx[k];
                    var ny=j+dy[k];
                    if((nx<0)||(ny<0)||(nx>=STAGE_SIZE_HEIGHT)||(ny>=STAGE_SIZE_WEIGHT)){continue;}
                    if(board[i][j]==board[nx][ny]){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    eraseStone(x,y){
        var board=this.getBoard();
        if(board[x][y]==0){
            return false;
        }

        var eraseColor=board[x][y];

        var countField=[];
        for(var i=0;i<STAGE_SIZE_HEIGHT;i++){
            countField[i]=[];
            for(var j=0;j<STAGE_SIZE_WEIGHT;j++){
                countField[i][j]=false;
            }
        }       
        var queue=[];
        queue.push({
            in:x,
            out:y
        });

        while(queue.length>0){
            var tmp=queue.shift();
            if(countField[tmp.in][tmp.out]==true){continue;}
            countField[tmp.in][tmp.out]=true;
            for(var i=0;i<4;i++){
                var nx=tmp.in+dx[i];
                var ny=tmp.out+dy[i];
                if((nx<0)||(ny<0)||(nx>=STAGE_SIZE_HEIGHT)||(ny>=STAGE_SIZE_WEIGHT)){continue;}
                if(board[nx][ny]==eraseColor){
                    var f={
                        in:nx,
                        out:ny
                    }
                    queue.push(f);
                }
            }
        }
        var size=0;
        for(var i=0;i<STAGE_SIZE_HEIGHT;i++){
            for(var j=0;j<STAGE_SIZE_WEIGHT;j++){
                if(countField[i][j]===true){
                    size++;
                }
            }
        }
        if(size<2){
            return false;
        }
        for(var i=0;i<STAGE_SIZE_HEIGHT;i++){
            for(var j=0;j<STAGE_SIZE_WEIGHT;j++){
                if(countField[i][j]===true){
                    this.stones[i][j].color=0;
                }
            }
        }
        if(eraseColor==1){
            countR-=size;
        }
        if(eraseColor==2){
            countG-=size;
        }
        if(eraseColor==3){
            countB-=size;
        }
        score+=(size-1)*(size-1);
        this.boardFall();
        this.leftJustified();
        return true;
    }

    boardFall(){
        var now_height=STAGE_SIZE_WEIGHT-1;

        for(var i=0;i<STAGE_SIZE_HEIGHT;i++){
            while(now_height>=0&&this.stones[i][now_height].color!=0){
                now_height--;
            }
            if(now_height<0){
                now_height=STAGE_SIZE_WEIGHT-1;
                continue;
            }
            for(var j=now_height;j>=0;j--){
                if(this.stones[i][j].color!=0){
                    this.stones[i][now_height].color=this.stones[i][j].color;
                    now_height--;
                    this.stones[i][j].color=0;
                }
            }
            now_height=STAGE_SIZE_WEIGHT-1;
        }
    }

    leftJustified(){
        for(var i=0;i<STAGE_SIZE_HEIGHT;i++){
            if(this.stones[i][STAGE_SIZE_WEIGHT-1].color==0){
                var ni=i+1;
                while(ni<STAGE_SIZE_HEIGHT&&this.stones[ni][STAGE_SIZE_WEIGHT-1].color==0){
                    ni++;
                }
                if(ni==STAGE_SIZE_HEIGHT){break;}
                for(var j=0;j<STAGE_SIZE_WEIGHT;j++){
                    this.stones[i][j].color=this.stones[ni][j].color;
                    this.stones[ni][j].color=0;
                }
            }
        }
    }
    
}

function Click(events){
    var rect=events.target.getBoundingClientRect();
    var x=events.clientX-rect.left;
    var y=events.clientY-rect.top;
    if(game.turn==0){
        return;
    }
    var X=~~(x/SQUARE_SIZE);
    var Y=~~(y/SQUARE_SIZE);
    if(X>STAGE_SIZE_HEIGHT||Y>STAGE_SIZE_WEIGHT){return;}
    game.eraseStone(X,Y);
    game.turnChange();
    return ;
}

function randomGenerator(min,max){
    var rand=Math.floor(Math.random()*(max-min))+min;
    return rand;
}

var game=new Board();
canvas.addEventListener('click',Click,false);