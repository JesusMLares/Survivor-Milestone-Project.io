class Player{
    constructor(game){
        //Properties of the player
        this.game = game;
        this.x = this.game.width * 0.5;
        this.y = this.game.height *0.5;
        this.radius = 10;
        this.speed = 1;

    }
        //Draws the player
    draw(context){
            context.beginPath();
            context.fillStyle = 'yellow';
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();  
        
        

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
        this.radius = 5;
        this.image = document.getElementById('crosshair');
        this.aim;
        this.angle = 0;
    }

    draw(context){
        //Draws crosshair
        context.save();//Restricts canvas state
        context.translate(this.x, this.y)
        context.rotate(this.angle);
        context.strokeStyle = 'white';
        context.drawImage(this.image, (-this.radius + 2), (-this.radius + 0), 10, 10);
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
        this.x = this.game.player.x + 16 * this.aim [0];
        this.y = this.game.player.y + 16 * this.aim[1];
        //Calculates angle of crosshair
        this.angle = Math.atan2(this.aim[3], this.aim[2]);
    }
    shoot(){
        //fire projectiles
        const projectile = this.game.getProjectile();
        //projectiles direction
        if (projectile) projectile.start(this.x + this.radius * this.aim [0], this.y + this.radius * this.aim[1], this.aim[0], this.aim[1])
        
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
        this.speedModifier = 3;
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
        //Projectile speed "See Line: 81"
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

class Enemy{
    constructor(game){
        this.game = game;
        this.x = 100;
        this.y = 100;
        this.radius = 10;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        this.speedX = 0;
        this.speedY = 0;
        this.speedModifier = .4;
        this.free = true;
        this.maxLives = 1;

    }
    //Makes enemy active from pool
    start(){
        this.free = false;

        //Enemy spawn location
        /* Using Ternary Operator (?) a form of an if else statement.

        1. Condition to evalutate 
        2. (?) if true... do this
        3. (:) if not... do this
        
        */
        if (Math.random() < 0.5){
            //Spawn top or bottom
            this.x = Math.random() * this.game.width;
            this.y = Math.random() < 0.5 ? 0: this.game.height + this.radius;
        } else {
            //spawn left or right
            this.x = Math.random() < 0.5 ? 0 : this.game.width + this.radius;
            this.y = Math.random () * this.game.height;
        }
        
        //Moves enemy towards player on start
        const aim = this.game.calcAim(this, this.game.player);
        this.speedX = aim[0] * this.speedModifier;
        this.speedY = aim[1] * this.speedModifier;
    }
    //Resets enemy back into pool
    reset(){
        this.free = true;
    }
    //Creates enemy shape
    draw(context){
        if (!this.free){
            context.beginPath();
            context.strokeStyle = 'purple';
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.stroke();
        }
    }
    update(){
        if (!this.free){
            //Constantly moves enemy towards player
            const aim = this.game.calcAim(this, this.game.player);
            this.speedX = aim[0] * this.speedModifier;
            this.speedY = aim[1] * this.speedModifier;
            this.x += this.speedX;
            this.y += this.speedY;

            //Check collision of enemy and player
            if (this.game.checkCollision(this, this.game.player)){
                this.reset();
            }

            //TODO: Remove later once crosshair fully created
            // 
            
            //Reset enemy and projectile on collision
            this.game.projectilePool.forEach(projectile=>{
                if (!projectile.free && this.game.checkCollision(this, projectile)){
                    projectile.reset();
                    this.reset()
                    //Update score on enemy kill
                    this.game.score += this.maxLives;
                }
            })

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

        /*** Projectiles ***/
        this.projectilePool = [];
        this.numberOfProjectiles = 30;
        this.createProjectilePool();

        /*** Enemies ***/
        this.enemyPool = [];
        this.numberOfEnemies = 30;
        this.createEnemyPool();
        this.enemyTimer = 0;
        this.enemyInterval = 300;

        //Mouse properties
        this.mouse = {
            x: 0,
            y: 0
        }

        //Score Properties
        this.score = 0;

        //Key Properties
        this.keys = [];
        
        //Only for dev use!
        this.debug = false;

        /*** event listeners & controls ***/
        //Adds key to array on kydown
        window.addEventListener('keydown', e =>{
            if(this.keys.indexOf(e.key) === -1) this.keys.push(e.key); //adds keys to array once
        });

        //Removes keys from array on keyup
        window.addEventListener('keyup', e =>{
            const index = this.keys.indexOf(e.key);
            if(index > -1) this.keys.splice(index, 1);

            //debug key checker
            if (e.key === ']') this.debug = !this.debug;
             if (e.key === ' ') this.crosshair.shoot()
 
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
    //Renders player, projectiles, enemies, etc.
    render(context, deltaTime){
        this.player.draw(context);
        this.player.update();

        this.drawStatusText(context);

        this.crosshair.draw(context)
        this.crosshair.update();

        this.projectilePool.forEach(projectile =>{
            projectile.draw(context);
            projectile.update()
        });
        this.enemyPool.forEach(enemy =>{
            enemy.draw(context);
            enemy.update()

        });
        //Periodically activate enemy
        if(this.enemyTimer < this.enemyInterval){
            this.enemyTimer += deltaTime;
        }else {
            this.enemyTimer = 0;
            const enemy = this.getEnemy();
            if(enemy)enemy.start()
        }

        //creats a visual line from the player to the mouse
        // context.beginPath();
        // context.moveTo(this.player.x, this.player.y);
        // context.lineTo(this.mouse.x, this.mouse.y);
        // context.stroke()
    }

    /***** Screen Text *****/
    drawStatusText(context){
        context.save();
        context.textAlign = 'left'
        context.font = '30px Impact';
        context.fillText('Score: ' + this.score, 20, 30);
        context.restore();

    }

    /***** Aim/Distance Method  *****/

    //Calculates aim reticle from player
    //Can also be used for other purposes
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

    /***** Check Collision Method  *****/

    checkCollision(a, b){
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        //Only works for circles!
        const sumOfRadii = a.radius + b.radius;
        return distance < sumOfRadii;

    }

    /***** Projectile Pool *****/

    //Create projectiles in pool
    createProjectilePool(){
        for (let i = 0; i < this.numberOfProjectiles; i++) {
            this.projectilePool.push (new Projectiles(this));
        }
    }
    //Cycles through pool for free projectiles
    getProjectile(){
        for (let i = 0; i < this.projectilePool.length; i++) {
            if(this.projectilePool[i].free) return this.projectilePool[i];  
        }
    }

    /***** Enemy Pool *****/

    //Create enemies in pool
    createEnemyPool(){
        for(let i = 0; i < this.numberOfEnemies; i++){
            this.enemyPool.push(new Enemy(this))
        }
    }
    //Cycles through pool for free enemies
    getEnemy(){
        for(let i = 0; i< this.enemyPool.length; i++){
            if (this.enemyPool[i].free) return this.enemyPool[i]
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
    

    /***** Animation loop *****/
    let lastTime = 0 //Time since last animation loop

    function animate(timeStamp){//Time since last requested animation frame
        const deltaTime = timeStamp - lastTime;//Number of miliseconds it takes our computer to serve 1 animation frame.
        lastTime = timeStamp;

        //clears canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx, deltaTime);
        window.requestAnimationFrame(animate);

        //Framerate
        //console.log(deltaTime);
    }

    animate()
})