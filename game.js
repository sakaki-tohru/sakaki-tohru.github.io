var canvas=document.getElementById("gameCanvas");
var drawingMethod=canvas.getContext("2d");

const STONE_SIZE=40;
const STAGE_SIZE=6;
const SQUARE_SIZE=100;
const PLAYER_COLOR=1;
const COM_COLOR=2;
const CONNECT_NUM=STAGE_SIZE-1;

var tmp_x=0,tmp_y=0;

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
        //初期配置
        for(var i=(STAGE_SIZE/2)-1; i<=STAGE_SIZE/2;i++){
            for(var j=(STAGE_SIZE/2)-1;j<=STAGE_SIZE/2;j++){
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
        if(this.turn==0){
            return ;
        }
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
        var fx=[1,0,1,1];
        var fy=[0,1,1,-1];

        for(var i=0;i<STAGE_SIZE;i++){
            for(var j=0;j<STAGE_SIZE;j++){
                for(var a=0;a<4;a++){
                    var tmp=0;
                    var col=this.stones[i][j].color;
                    for(var k=1;true;k++){
                        var x=fx[a]*k+i;
                        var y=fy[a]*k+j;
                        if(x<0||x>=STAGE_SIZE||y<0||y>=STAGE_SIZE){
                            break;
                        }
                        if(this.stones[x][y].color==0||this.stones[x][y].color==otherColor(col)){
                            break;
                        }
                        if(this.stones[x][y].color==col){
                            tmp++;
                        }
                    }
                    for(var k=-1;true;k--){
                        var x=fx[a]*k+i;
                        var y=fy[a]*k+j;
                        if(x<0||x>=STAGE_SIZE||y<0||y>=STAGE_SIZE){
                            break;
                        }
                        if(this.stones[x][y].color==0||this.stones[x][y].color==otherColor(col)){
                            break;
                        }
                        if(this.stones[x][y].color==col){
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

    countSpace(){
        var field=this.getBoard();
        var res=0;
        for(var i=0;i<STAGE_SIZE;i++){
            for(var j=0;j<STAGE_SIZE;j++){
                if(field[i][j]==0){
                    res++;
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

function Click(events){
    var rect=events.target.getBoundingClientRect();
    var x=events.clientX-rect.left;
    var y=events.clientY-rect.top;
    if(game.turn==0){
        return;
    }
    var X=~~(x/SQUARE_SIZE);
    var Y=~~(y/SQUARE_SIZE);
    if(X>STAGE_SIZE||Y>STAGE_SIZE){return;}
    if(game.putStone(X,Y,PLAYER_COLOR)){
        game.turnChange();
        if(game.turn==0){
            return;
        }
    }
    else{
        return;
    }
    com_action(game);
    game.turnChange();
    return ;
}

function try_com(){

}

function randomGenerator(min,max){
    var rand=Math.floor(Math.random()*(max-min))+min;

    return rand;
}

//クソ雑魚AIやめてくださいちょっとｗ
function com_action(board){

    if(searchAllMoves1(board,COM_COLOR)){
        console.log("Yeah!!searchAllMoves1");
        x=tmp_x;
        y=tmp_y;
        if(board.putStone(x,y,COM_COLOR)){
            return;
        }
    }
    if(searchAllMoves2(board,COM_COLOR)){
        console.log("Yeah!!searchAllMoves2");
        x=tmp_x;
        y=tmp_y;
        if(board.putStone(x,y,COM_COLOR)){
            return;
        }
    }
    console.log("Yeah!! else");
    var max_score=0;
    var x=0,y=0;
    for(var i=0;i<STAGE_SIZE;i++){
        for(var j=0;j<STAGE_SIZE;j++){
            var tmp=board.reverse(i,j,COM_COLOR);
            if(tmp.length>max_score){
                max_score=tmp.length;
                x=i;
                y=j;
            }
            else if(tmp.length==max_score){
                a=randomGenerator(1,4);
                if(a==3){
                    x=i;
                    y=j;
                }
            }
        }
    }

    if(board.putStone(x,y,COM_COLOR)){
        return;
    }
    else{
        while(!board.putStone(x,y,COM_COLOR)){
            x=randomGenerator(0,STAGE_SIZE);
            y=randomGenerator(0,STAGE_SIZE);
        }
        return;
    }
}

function setField(field1,field2){
    for(var i=0;i<STAGE_SIZE;i++){
        for(var j=0;j<STAGE_SIZE;j++){
            field1.stones[i][j].x=field2.stones[i][j].x;
            field1.stones[i][j].y=field2.stones[i][j].y;
            field1.stones[i][j].color=field2.stones[i][j].color;
        }
    }
    return ;
}

function searchAllMoves1(board,color){
    var Field=new Board();
    for(var i=0;i<STAGE_SIZE;i++){
        for(var j=0;j<STAGE_SIZE;j++){
            setField(Field,board);
            if(Field.putStone(i,j,color)){
                if(Field.victory()){
                    tmp_x=i;
                    tmp_y=j;
                    return true;
                }
            }
        }
    }
    return false;
}

function searchAllMoves2(board,color){
    var field1=new Board();
    var check=false;
    for(var f=0;f<STAGE_SIZE;f++){
        for(var g=0;g<STAGE_SIZE;g++){
            setField(field1,board);
            if(field1.putStone(f,g,color)){
                if(field1.victory()){
                    tmp_x=f;
                    tmp_y=g;
                    return true;
                }
                if(searchAllMoves1(field1,PLAYER_COLOR)){
                    return false;
                }
                else{
                    var rand=randomGenerator(1,3);
                    if(field1.reverse(f,g,color).length>0){
                        check=true;
                        tmp_x=f;
                        tmp_y=g;
                        if(rand==2){
                            return true;
                        }
                    }
                }
            }

        }
    }
    return false;
}

var game=new Board();

function draw(){
    game.draw();
    return ;
}

canvas.addEventListener('click',Click,false);
setInterval(draw,30);