
var HelloWorldLayer = cc.Layer.extend({
	helloLabel: null,

	snake: null,
	len: null,
	head: null,
	snakePos: null,
	up: null,
	down: null,
	right: null,
	left: null,
	enemy: null,
	moveInterval: null,
    ctor:function () {
        this._super();
    	this.dt = 400;
    	this.moveInterval = null;

        this.right = true;
        this.up = this.left = this.down = false;
        //enemy
        this.enemy = new cc.Sprite(res.Enemy_png);
        this.enemy.setPosition(cc.p(200, 200));
        this.addChild(this.enemy);

        var size = cc.winSize;
        //set len = 3
        this.len = 3;
        //set snake array
        this.snake = [];
        this.snakePos = [];
        this.setSnakePos(100, 100);

        //
        for(var i = 0; i < this.snakePos.length; ++i) {
            this.snake.push(new cc.Sprite(res.SnakeImage_png));
            this.snake[i].setPosition(this.snakePos[i]);
            this.addChild(this.snake[i]);
        }
		this.helloLabel = new cc.LabelTTF("score" + this.len, "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.x = size.width / 2;
        this.helloLabel.y = size.height / 2 + 200;
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        //get keyboard
        if( 'keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (keyCode, event) {
                    switch (keyCode) {
                        case cc.KEY.up:
                            this.moveUp();
                            //this.check();
                            break;
                        case cc.KEY.down:

                            this.moveDown();
                            //this.check();
                            break;
                        case cc.KEY.right:
                            this.moveRight();
                            //this.check();
                            break;
                        case cc.KEY.left:
                            this.moveLeft();
                            //this.check();
                            break;
                    }
                }.bind(this)
            }, this);

        }
       return true;
    },
    setSnakePos: function(x, y) {
    	for(var i = 0; i < this.len; ++i) {
        	this.snakePos.push(cc.p(x -i*20, y));
        }
    },

    checkGameOver: function() {
        for (var i = 1; i < this.snakePos.length; i++) {
            if(this.snakePos[0].x == this.snakePos[i].x &&
                this.snakePos[0].y == this.snakePos[i].y) {
                    if (this.moveInterval){
            			clearInterval(this.moveInterval);
        			}
                    break;
            }
        }
        for (var i = 0; i < this.snakePos.length; i++) {
        	if (this.snakePos[i].y === 0){
        		this.snakePos[i].y = cc.winSize.height;

        	} else if(this.snakePos[i].x === 0) {
        		this.snakePos[i].x = cc.winSize.width;

        	} else if(this.snakePos[i].y === cc.winSize.height) {
        		this.snakePos[i].y = 0;
        	}
        }
        this.updatePos();

    },
    checkEnemy: function() {
        //cc.log("checkEnemy");
        if(this.snakePos[0].x === this.enemy.x &&
            this.snakePos[0].y === this.enemy.y) {
            this.addSnake();
        	return true;
        }
    },

    addEnemy: function(){
        var success = false;
        var x, y;
        do{
            x = Math.floor(Math.floor(Math.random() * (cc.winSize.width - 40) +20)/20);
            y = Math.floor(Math.floor(Math.random() * (cc.winSize.height - 40) +20)/20);
            for (var i = 0; i < this.len; i++){
                if (this.snakePos[i].x === x &&
                    this.snakePos[i].y === y){
                    success = true;
                    break;
                }
            }
        }while(success);
        cc.log(x + " " + y);
        this.enemy.setPosition(cc.p(20*x, 20*y));
    },

    addSnake: function(){
        cc.log("addSnake");
        var len = this.len;
        if (len < 2) return;
        var pos = cc.p(2*this.snakePos[len-1].x - this.snakePos[len-2].x,
                2*this.snakePos[len-1].y - this.snakePos[len-2].y);
        this.snakePos.push(pos);

        var sp = new cc.Sprite(res.SnakeImage_png);
        this.snake.push(sp);
        this.addChild(sp);
        this.len ++;
        this.helloLabel.setString("Score" + this.len);
        this.updatePos();
    },

    check: function() {
    	this.checkGameOver();
        if(this.checkEnemy()) {
        	this.addEnemy();
        }

    },
    updatePos: function() {
    	for(var i = 0; i < this.snakePos.length; ++i) {
        	this.snake[i].setPosition(this.snakePos[i]);
        }
    },

   moveUp: function() {

   		if(this.down || this.up) {
   			return;
   		}

        if (this.moveInterval){
            clearInterval(this.moveInterval);
        }
   		this.moveInterval = setInterval(function(){
            this.check();
        	this.up = true;
   			this.down = this.right = this.left = false;
        	this.snakePos[this.len - 1].x = this.snakePos[0].x;
        	this.snakePos[this.len - 1].y = this.snakePos[0].y + 20;
        	this.snakePos.unshift(this.snakePos[this.len -1]);
        	this.snakePos.pop();
        	this.updatePos();
        }.bind(this), this.dt);
	},


	moveDown: function() {

		if(this.up || this.down) {
			return;
		}
        if (this.moveInterval){
            clearInterval(this.moveInterval);
        }
		this.moveInterval = setInterval(function(){
            this.check();
   			this.down = true;
   			this.up = this.right = this.left = false;
			this.snakePos[this.len - 1].x = this.snakePos[0].x;
        	this.snakePos[this.len - 1].y = this.snakePos[0].y - 20;
        	this.snakePos.unshift(this.snakePos[this.len -1]);
        	this.snakePos.pop();
        	this.updatePos();
        }.bind(this), this.dt);
	},

	moveRight: function() {

		if(this.left || this.right) {
			return;
		}
        if (this.moveInterval){
            clearInterval(this.moveInterval);
        }
		this.moveInterval = setInterval(function(){
             this.check();
   			this.right = true;
   			this.down = this.up = this.left = false;
        	this.snakePos[this.len - 1].x = this.snakePos[0].x +20;
        	this.snakePos[this.len - 1].y = this.snakePos[0].y;
        	this.snakePos.unshift(this.snakePos[this.len -1]);
        	this.snakePos.pop();
        	this.updatePos();
        }.bind(this), this.dt);
	},

	moveLeft: function() {

		if(this.right || this.left)  {
			return;
		}
        if (this.moveInterval){
            clearInterval(this.moveInterval);
        }
		this.moveInterval = setInterval(function(){
            this.check();
   			this.left = true;
   			this.down = this.right = this.up = false;
			this.snakePos[this.len - 1].x = this.snakePos[0].x - 20;
        	this.snakePos[this.len - 1].y = this.snakePos[0].y;
        	this.snakePos.unshift(this.snakePos[this.len - 1]);
        	this.snakePos.pop();
        	this.updatePos();
        }.bind(this), this.dt);
	}

});

// var MenuLayer = cc.Layer.extend({
//     menu: null,
//     ctor: function()
//     {
//         this._super();
//         var size = cc.winSize;
//         this.addChild(size);
//         var item1 = new cc.MenuItemFont("Test pushScene", this.onPushScene, this);
//         var item2 = new cc.MenuItemFont("Test pushScene w/transition", this.onPushSceneTran, this);
//         var item3 = new cc.MenuItemFont("Quit", function () {
//             cc.log("quit!")
//         }, this);
//         this.menu = cc.Menu(item1, item2, item3);
//         this.menu.alignItemsHorizontally();
//         this.addChild(this.menu);

//     }

// });




var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
        
    }
});

