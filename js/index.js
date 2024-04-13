class Player{
    constructor(game){
        this.game = game; //pointing to game
        /*** properties of player ***/
        this.width = 25;
        this.height = 25;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.speed = 1;
    }
    draw(context){//specifies which canvas we want to draw on.
        context.fillRect(this.x, this.y, this.width, this.height);
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
    shoot(){
        const projectile = this.game.getProjectile()
        if(projectile) projectile.start(this.x, this.y);
    }


}

class Projectile{
    constructor(){
        this.width = 2;
        this.height = 10;
        this.x = 20;
        this.y = 20;
        this.speed = 20;
        this.free = true; //Projectile availability 
    }
    draw(context){
        if(!this.free){
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    update(){
        if(!this.free){
            this.y -= this.speed;
        }
    }
    start(x, y){
        this.x = x;
        this.y = y;
        this.free = false;
    }
    reset(){
        this.free = true;
    }
}

class Enemy{

}

class Game{
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width; 
        this.height = this.canvas.height;
        this.player = new Player(this);
        this.keys = [];

        this.projectilesPool = [];
        this.numberOfProjectiles = 10;
        this.createProjectiles();

        /*** event listeners & controls ***/
        window.addEventListener('keydown', e =>{
            if(this.keys.indexOf(e.key) === -1) this.keys.push(e.key); //adds keys to array once
            console.log(this.keys)
        });

        window.addEventListener('keyup', e =>{
            const index = this.keys.indexOf(e.key);
            if(index > -1) this.keys.splice(index, 1)//removes keys from array on keyup
            if(e.key === '1') this.player.shoot();
        });

    }
    render(context){
        this.player.draw(context);
        this.player.update();
        this.projectilesPool.forEach(projectile =>{
            projectile.update()
            projectile.draw(context)
        })
    }
    //create projectile object pool
    createProjectiles(){
        for (let i = 0; i < this.numberOfProjectiles; i++) {
            this.projectilesPool.push(new Projectile()) 
        }
    }
    //get free projectile object from the pool
    getProjectile(){
        for (let i = 0; i < this.projectilesPool.length; i++) {
            if(this.projectilesPool[i].free) return this.projectilesPool[i];
            
        }
    }



}

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d'); //Access to all 2 canvas properties.
    canvas.width = 600;
    canvas.height = 800;

    const game = new Game(canvas);
    

    function animate(){//create animation loop
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx);
        window.requestAnimationFrame(animate);
    }

    animate()

})