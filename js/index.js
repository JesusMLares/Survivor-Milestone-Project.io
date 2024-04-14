class Player{
    constructor(game){
        //Properties of the player
        this.game = game;
        this.x = this.game.width * 0.5;
        this.y = this.game.height *0.5;
        this.raidus = 20;
        this.speed = 1;

    }
        //Draws the player
    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.raidus, 0, Math.PI * 2);
        context.stroke();


    }
    update(){ 
        //movement
        if (this.game.keys.indexOf('a') > -1)this.x -= this.speed;
        if (this.game.keys.indexOf('d') > -1)this.x += this.speed;
        if (this.game.keys.indexOf('w') > -1)this.y -= this.speed;
        if (this.game.keys.indexOf('s') > -1)this.y += this.speed;

        //boundaries
        if(this.x < 0) this.x = 0;
        else if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        if(this.y < 0) this.y = 0;
        else if (this.y > this.game.height -this.height) this.y = this.game.height - this.height;
    }
}

class Game{
    constructor(canvas){
        //Properties of game: size, objects, etc
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.player = new Player(this);

        //Mouse properties
        this.mouse = {
            x: 0,
            y: 0
        }

        //Key Properties
        this.keys = [];

        /*** event listeners & controls ***/
        window.addEventListener('keydown', e =>{
            if(this.keys.indexOf(e.key) === -1) this.keys.push(e.key); //adds keys to array once
        });

        window.addEventListener('keyup', e =>{
            const index = this.keys.indexOf(e.key);
            if(index > -1) this.keys.splice(index, 1)//removes keys from array on keyup
 
        });

        //Track mousemovement
        window.addEventListener('mousemove', (e)=>{
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        })
    }
    //Render player, projectiles, etc
    render(context){
        this.player.draw(context);
        this.player.update()

        //creats a visual line from the player to the mouse
        context.beginPath();
        context.moveTo(this.player.x, this.player.y);
        context.lineTo(this.mouse.x, this.mouse.y);
        context.stroke()
    }
}

window.addEventListener('load', function(){
    //Canvas properties and methods
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d')
    canvas.width = 800;
    canvas.height = 800;

    //Allows game to reference canvas
    const game = new Game(canvas);
    

    //Animation loop
    function animate(){
        //clears canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx);
        window.requestAnimationFrame(animate);
    }

    animate()
})