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
        if(this.game.debug){
            context.beginPath();
            context.strokeStyle = 'white';
            context.arc(this.x, this.y, this.raidus, 0, Math.PI * 2);
            context.stroke();  
        }
        

    }
    update(){ 
        //Player movement WASD
        if (this.game.keys.indexOf('a') > -1)this.x -= this.speed;
        if (this.game.keys.indexOf('d') > -1)this.x += this.speed;
        if (this.game.keys.indexOf('w') > -1)this.y -= this.speed;
        if (this.game.keys.indexOf('s') > -1)this.y += this.speed

        //Player movement ArrowKeys
        if (this.game.keys.indexOf('ArrowLeft') > -1)this.x -= this.speed;
        if (this.game.keys.indexOf('ArrowRight') > -1)this.x += this.speed;
        if (this.game.keys.indexOf('ArrowUp') > -1)this.y -= this.speed;
        if (this.game.keys.indexOf('ArrowDown') > -1)this.y += this.speed

        //Player boundaries
        if(this.x < 0) this.x = 0;
        else if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        if(this.y < 0) this.y = 0;
        else if (this.y > this.game.height -this.height) this.y = this.game.height - this.height;
    }
}

class Crosshair{
    //Crosshair properties
    constructor(game){
        this.game = game;
        this.x = this.game.width * 0.5;
        this.y = this.game.height * 0.5;
        this.radius = 10;
        this.image = document.getElementById('player');
        this.aim;
        this.angle = 0;
    }

    draw(context){
        //Draws crosshair
        context.save();//Restricts canvas state
        context.translate(this.x, this.y)
        context.rotate(this.angle);
        context.strokeStyle = 'white';
        context.drawImage(this.image, (-this.radius + 1.5), (-this.radius + 2.0));
        if(this.game.debug){
            context.beginPath();
            context.arc(0, 0, this.radius, 0, Math.PI * 2);
            context.stroke();
        }
        
        context.restore();
    }
    update(){
        //Places crosshair around player using calcAim
        this.aim = this.game.calcAim(this.game.player, this.game.mouse);
        this.x = this.game.player.x + 30 * this.aim [0];
        this.y = this.game.player.y + 30 * this.aim[1];
        //Calculates angle of crosshair
        this.angle = Math.atan2(this.aim[3], this.aim[2]);
    }
    shoot(){
        //fire projectiles
        const projectile = this.game.getProjectile();
        //projectiles direction
        if (projectile) projectile.start(this.x, this.y, this.aim[0], this.aim[1])
        
    }
}

class Projectiles{
    //Projectile properties
    constructor(game){
        this.game = game;
        this.x;
        this.y;
        this.radius = 2;
        this.speedX = 1;
        this.speedY = 1;
        this.speedModifier = 4;
        this.free = true;
    }
    //Makes projectile active from pool
    start(x, y, speedX, speedY){
        this.free = false;
        this.x = x;
        this.y = y;
        this.speedX = speedX * this.speedModifier;
        this.speedY = speedY * this.speedModifier;
    }
    //Reset projectile in pool
    reset(){
        this.free = true;
    }
    //Draw projectile
    draw(context){
        if (!this.free){
            context.save()
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fillStyle = 'gold'
            context.fill();
            context.restore()
        }
    }
    update(){
        //Projectile speed
        if (!this.free){
            this.x += this.speedX;
            this.y += this.speedY;
        }
        //Reset projectile
        if(this.x < 0 || this.x > this.game.width || this.y <0 || this.y > this.game.height){
            this.reset()
        }
    }
}

class Game{
    constructor(canvas){
        //Properties of game: size, objects, etc
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.player = new Player(this);
        this.crosshair = new Crosshair(this);
        this.projectile = new Projectiles(this)

        this.projectilePool = [];
        //Amount of projectils
        this.numberOfProjectiles = 20;
        this.createProjectilePool();

        //Mouse properties
        this.mouse = {
            x: 0,
            y: 0
        }

        //Only for dev use
        this.debug = true;

        //Key Properties
        this.keys = [];

        /*** event listeners & controls ***/
        //Adds key to array on kydown
        window.addEventListener('keydown', e =>{
            if(this.keys.indexOf(e.key) === -1) this.keys.push(e.key); //adds keys to array once
            console.log(this.keys)
        });

        //Removes keys from array on keyup
        window.addEventListener('keyup', e =>{
            const index = this.keys.indexOf(e.key);
            if(index > -1) this.keys.splice(index, 1);

            //debug key checker
            if (e.key === ']') this.debug = !this.debug;
 
        });

        //Track mousemovement of mouse
        window.addEventListener('mousemove', (e)=>{
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        });

        //Click event
        window.addEventListener('mousedown', (e)=>{
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.crosshair.shoot()
        })
    }
    //Renders player, projectiles, etc
    render(context){
        this.player.draw(context);
        this.player.update();

        this.crosshair.draw(context)
        this.crosshair.update();

        this.projectilePool.forEach(projectile =>{
            projectile.draw(context);
            projectile.update()
        })

        //creats a visual line from the player to the mouse
        // context.beginPath();
        // context.moveTo(this.player.x, this.player.y);
        // context.lineTo(this.mouse.x, this.mouse.y);
        // context.stroke()
    }
    //Calculates aim reticle from player
    calcAim(a, b){//(mouse, player)
        //distance between two objects 
        const dx = a.x - b.x; 
        const dy = a.y - b.y;
        //JavaScript Pythagorean Theorem
        const distance = Math.hypot(dx, dy);
        const aimX = dx / distance * -1;
        const aimY = dy / distance * -1;
        return[aimX, aimY, dx, dy];
    };
    //Create projectiles for pool
    createProjectilePool(){
        for (let i = 0; i < this.numberOfProjectiles; i++) {
            this.projectilePool.push (new Projectiles(this));
        }
    }
    //Cycle through pool for free projectiles
    getProjectile(){
        for (let i = 0; i < this.projectilePool.length; i++) {
            if(this.projectilePool[i].free) return this.projectilePool[i];  
        }
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