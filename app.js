let paddle_width=90;
let paddle_height=13;;
let paddle_margin_bottom=15;
let c=document.getElementById("brick-canvas");
let ctx=c.getContext('2d');
let rightarrow=false;
let leftarrrow=false;
let ball_radius=10;
var score=0;
var game_over=false
let bricks=[]
var max=0;

var bgm=new Audio("sound/Overworldtrim.mp3");
var coin=new Audio("sound/cointrim.mp3");
coin.volume=0.1;
coin.duration=0.5;

document.getElementById('over').innerHTML="Press enter to start game";
var scores=[0];

const color={
    column:['red','yellow','green','blue','violet']
}

//Creating Paddle object
const paddle={
    x:c.width/2-paddle_width/2,
    y:c.height-paddle_height-paddle_margin_bottom,
    width:paddle_width,
    height:paddle_height,
    dx:7
}

//Creating ball object
const ball={
    x:c.width/2,
    y:paddle.y-ball_radius,
    radius:ball_radius,
    dx:6*(Math.random()*2-1),
    dy:-6,
    speed:6
}

//Creating Brick object
const brick={
    row:4,
    column:7,
    width:65,
    height:20,
    offSetLeft:20,
    offSetTop:20,
    marginTop:35,
    marginLeft:15,
    fillColor:'purple',
    strokeColor:'#eee'
}


document.addEventListener("keydown",function(e){
    if(e.keyCode==37)
    {
        leftarrrow=true;
    }
    else if(e.keyCode==39){
        rightarrow=true;
    }
    
})

document.addEventListener("keypress",(e) => {
    if(e.keyCode==13)
    {
        draw();
        setTimeout(start,500);
    }       
})

document.addEventListener("keyup",function(e){
    if(e.keyCode==37)
    {
        leftarrrow=false;
    }
    else if(e.keyCode==39){
        rightarrow=false;
    }
})

function drawPaddle(){
    ctx.beginPath();
    ctx.fillStyle='#aaa';
    ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
    ctx.strokeStyle="10px black"
    ctx.strokeRect(paddle.x,paddle.y,paddle.width,paddle.height)
    ctx.closePath();
}

//Creating Brick
function createBrick()
{
    for(let r=0;r<brick.row;r++){
        bricks[r]=[];
        for(let c=0;c<brick.column;c++)
        {
            bricks[r][c]={
                x:c*(brick.offSetLeft+brick.width)+brick.offSetLeft+brick.marginLeft, 
                y:r*(brick.height+brick.offSetTop)+brick.offSetTop+brick.marginTop,
                status:true
            }
        }
    }
}

//Drawing Bricks
function drawBrick(){
    for(let r=0;r<brick.row;r++){
        for(let c=0;c<brick.column;c++)
        {

            if(bricks[r][c].status){
                ctx.fillStyle=color.column[r];
                ctx.strokeStyle="black"
                ctx.fillRect(bricks[r][c].x,bricks[r][c].y,brick.width,brick.height);
                ctx.strokeRect(bricks[r][c].x,bricks[r][c].y,brick.width,brick.height)
            }
        }
    }
}

//Detecting Collision between ball and brick
function ballBrickCollision(){
    for(let r=0;r<brick.row;r++){
        for(let c=0;c<brick.column;c++)
        {
            let b=bricks[r][c];
            if(b.status){
                if(ball.x+ball.radius>b.x && ball.x-ball.radius<b.x+brick.width && ball.y+ball.radius>b.y && ball.y-ball.radius<b.y+brick.height){
                    coin.play();
                    score=score+1;
                    b.status=false
                    ball.dy=-ball.dy;
                    max=Math.max.apply(null,scores);
                    if(max<score)
                        max=score;
                    if(score>=(brick.row*brick.column))
                    {
                        bgm.pause();
                        alert("You won the game!  Press OK or Enter to restart game")
                        document.location.reload()
                    }
                }
            }
        }
    }
}

//Placing score
function drawScore(){
    ctx.font = '18px Arial';
    ctx.fillStyle = '#111';
    ctx.fillText('Score: '+ score, 30, 35); 
}

function gameReady(text,xaxis,yaxis){
    ctx.font = '45px Arial';
    ctx.fillStyle = '#111';
    ctx.fillText(text, xaxis, yaxis); 
}

function gameInst(text,xaxis,yaxis){
    ctx.font = '23px Arial';
    ctx.fillStyle = '#111';
    ctx.fillText(text, xaxis, yaxis); 
}

function drawHighScore(){
    ctx.font = '18px Arial';
    ctx.fillStyle = '#111';
    ctx.fillText('High-Score: '+ max, 480, 35); 
    ctx.font = '25px Arial';
    ctx.fillStyle = '#111';
    ctx.fillText('Brick-Breaker' ,250, 25); 
}

function arrow(){
    if(rightarrow && paddle.x+paddle.width<c.width)
    {
        paddle.x+=paddle.dx;
    }
    else if(leftarrrow && paddle.x>0){
        paddle.x-=paddle.dx;
    }
}

function drawBall(){
    ctx.beginPath()
    ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2)
    ctx.fillStyle="red"
    ctx.strokeStyle="black"
    ctx.stroke()
    ctx.fill()
    ctx.closePath()
}

function scoring()
{
    document.getElementById('score').innerHTML=score;
}

function moveBall()
{
    ball.x+=ball.dx
    ball.y+=ball.dy
}

function ballWallCollision(){
    if(ball.x+ball.radius>=c.width)
    {
        ball.dx=-ball.dx;
    }
    if(ball.y-ball.radius<=0)
    {
        ball.dy=-ball.dy;
    }
    if(ball.x-ball.radius<=1)
    {
        ball.dx=-ball.dx;
    }
    if(ball.y+ball.radius>c.height)
    {
        resetBall();
    }
}

function ballPaddleCollision(){
    if(ball.x<paddle.x+paddle.width && ball.x>paddle.x && ball.y+ball.radius>paddle.y && ball.y<paddle.y+paddle.height)
    {
        let collidePoint=ball.x-(paddle.x+paddle.width/2);
        collidePoint=collidePoint/(paddle.width/2);
        let angle=collidePoint*(Math.PI/3);
        ball.dx=ball.speed*Math.sin(angle);
        ball.dy=-ball.speed*Math.cos(angle);
    }
}

function resetBall(){
    gameReady("Game Over !!!",180,250);
    document.getElementById('over').innerHTML="Your Score is  "+score+"<br/>Press enter to restart game";
    // alert("Game Over");
    game_over=true;
    bgm.pause();
    scores.push(score);
    max=Math.max.apply(null,scores);
    score=0;
    ball.x=c.width/2;
    ball.y=paddle.y-ball_radius;
    ball.dx=6*(Math.random()*2-1);
    ball.dy=-6;
    paddle.x=c.width/2-paddle_width/2;
    paddle.y=c.height-paddle_height-paddle_margin_bottom;
    leftarrrow=false;
    rightarrow=false;
    game_over=true;
    createBrick();
}

function draw(){
    ctx.clearRect(0,0,c.width,c.height)
    drawPaddle();
    drawBall();
    drawBrick();
    drawScore();
    drawHighScore();
}

function update()
{
    arrow()
    moveBall()
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
}
function loop()
{
    draw()
    update()
    if(game_over) return;
    requestAnimationFrame(loop)
}


function start()
{
    bgm.play();
    game_over=false
    document.getElementById('over').innerHTML=" ";
    bgm.loop=true;
    loop();
}
drawPaddle();
drawBall();
createBrick();
// drawBrick();
drawScore();
drawHighScore();
gameReady("Ready!",250,230);
gameInst("Use < or > arrow key to move paddle",140,270);
console.log("Javascript")
console.log(bricks)
