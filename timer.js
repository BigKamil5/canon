var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth-5;
canvas.height = window.innerHeight-5;

var c = canvas.getContext('2d');

var missilearr =[];
var firearr = [];
var wayarr = [];
var firwayarr = [];
var colors=['#F9024B','#100FE5','#F8D900','#F82A00','#31DD15','#9B00F9','#BBE500','#F88800','#F8000E','1DDD8E'];
//img = loadImage("exam.png");

//console.log(img);

var mouse = {
	x: undefined,
	y: undefined
}

var canon = {
	x : undefined,
	y : undefined,
	angle : undefined,
	angle2 : undefined
}

var dlt=(window.innerWidth-5)/180;


var angle=0;


function lineToAngle(ctx, x1, y1, length, angle)
{

		angle *= Math.PI / 180;
		//console.log(angle);
		canon.angle2 = angle;
		
		var x2 = x1 + length * Math.cos(angle),
			y2 = y1 + length * Math.sin(angle);

		
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);

		canon.x = x2;
		canon.y = y2;
		//return {x: x2, y: y2};

}

function canon_movement()
{
	
	
	canon.angle = (Math.abs(mouse.x-window.innerWidth))/dlt;
	canon.angle = -canon.angle;
	c.beginPath();
	lineToAngle(c, ((window.innerWidth-5)/2),window.innerHeight, 80, canon.angle);
	c.lineWidth=20;
	c.stroke();
	c.strokeStyle="#938C94";

	c.beginPath();
	c.arc((window.innerWidth-5)/2,window.innerHeight,30,0,Math.PI*2,false);
	c.fillStyle ="#938C94";
	c.fill();
}

function Missile()
{
	this.x = canon.x;
	this.y = canon.y;
	this.r = 8;
	this.speed = Math.floor((Math.random() * 1) + 4);
	this.life = 90;
	this.numbOfFireworks=Math.floor((Math.random() * 20) + 10);
	this.color = 'rgba(102, 153, 255, 1)';
	this.dx = Math.cos(canon.angle2);
	this.dy = Math.sin(canon.angle2);
	this.maxArrIndex=0;

	this.draw = function()
	{
		
		var grd=c.createRadialGradient(this.x,this.y,0.2,this.x,this.y,this.r);
		grd.addColorStop(0,"white");
		grd.addColorStop(1,this.color);

		c.beginPath();
		c.arc(this.x,this.y,this.r,0,Math.PI*2,false);
		c.fillStyle = grd;
		c.fill();
	} 

	this.explode = function()
	{
		if(this.life>45)
		{
			this.speed += this.speed*0.02;
		}
		else if(this.life<35)
		{
			this.speed -= this.speed*0.04;
		}

		if(this.life<10)
		{
			this.dy += 0.1;
		}


		if(this.life == 0)
		{

			for(var i=0;i<this.numbOfFireworks;i++)
			{
				firearr.push(new Firework(this.x,this.y));
			}
			var index = missilearr.indexOf(this);
			missilearr.splice(index,1);

		}
	}

	this.makeway = function()
	{

		wayarr.unshift(new Way(this.x,this.y,this.r));
		this.maxArrIndex +=1;


		if(this.maxArrIndex>15)
		{
			wayarr.pop();
		}

	}


	this.update = function()
	{

		this.explode();
		this.x += this.speed*this.dx;
		this.y += this.speed*this.dy;
		this.life -= 1;
		this.makeway();

	}
}

function Way(x,y,r)
{
	this.x=x;
	this.y=y;
	this.r=r;
	this.opacity=1;

	this.draw = function()
	{
		
		c.beginPath();
		c.arc(this.x,this.y,this.r,0,Math.PI*2,false);
		c.fillStyle = 'rgba(102, 153, 255,'+this.opacity+')';
		c.fill();
	}

	this.update = function()
	{
		this.opacity -= 0.08;
	}
}

function Firework(x,y)
{
	this.x=x;
	this.y=y;
	this.r=Math.floor((Math.random() * 6) + 3);
	this.color = colors[Math.floor((Math.random() * colors.length))];

	this.dx = (Math.random()-0.5)*15;
	this.dy = (Math.random()-0.5)*15;

	this.maxArrIndex =0;

	this.draw = function()
	{
		c.save();
		c.beginPath();
		c.arc(this.x,this.y,this.r,0,Math.PI*2,false);
		c.fillStyle = this.color;
		c.fill();
		c.restore();
	} 

	this.update=function()
	{
		this.x += this.dx;
		this.y += this.dy;
		this.control();
		this.makeway();

	}

	this.makeway = function()
	{


		firwayarr.unshift(new FireworkWay(this.x,this.y,this.r,this.color));
		
		this.maxArrIndex +=1;
		
		if(this.maxArrIndex>6)
		{
			firwayarr.pop();
		}


	}

	this.control = function()
	{
		if(this.x>canvas.width || this.x <0 || this.y>canvas.height || this.y<0)
		{
			var index = firearr.indexOf(this);
			firearr.splice(index,1);
		}

		if(this.dx<0.2 && this.dx>-0.2 && this.dy<0.2 && this.dy>-0.2)
		{
			var index = firearr.indexOf(this);
			firearr.splice(index,1);
		}

	}

}

function FireworkWay(x,y,r,color)
{
	{
		this.x=x;
		this.y=y;
		this.r=r;
		this.opacity=1;
		this.color = color;
		this.life = 10;
	
		this.draw = function()
		{
			
			c.save();
			c.globalAlpha=this.opacity;
			c.beginPath();
			c.arc(this.x,this.y,this.r,0,Math.PI*2,false);
			c.fillStyle = this.color;
			c.fill();
			c.restore();
		}
	
		this.update = function()
		{
			if(this.opacity>=0)
			{
				this.opacity -= 0.1;
			}

			this.life -=1;
		}
	}
	
}


window.addEventListener('click',function(event){
	missilearr.push(new Missile());
})

window.addEventListener('resize',function(event){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
})

window.addEventListener('mousemove',function(event){
	mouse.x = event.x;
	mouse.y = event.y;
	//console.log(mouse.x," , ",mouse.y);
})






function anime()
{
	requestAnimationFrame(anime);
	c.clearRect(0,0,window.innerWidth,window.innerHeight);
	canon_movement();
	for(i=0;i<missilearr.length;i++)
	{
		missilearr[i].draw();
		missilearr[i].update();
	}

	for(i=0;i<wayarr.length;i++)
	{
		wayarr[i].draw();
		wayarr[i].update();
	}

	for(i=0;i<firearr.length;i++)
	{
		if((firearr[i].dx >2 || firearr[i].dx<-2) && (firearr[i].dy >2 || firearr[i].dy<-2))
		{
			firearr[i].draw();
			firearr[i].update();
		}
		else
		{
			firearr.splice(i,1);
		}
	}

	for(i=0;i<firwayarr.length;i++)
	{

		if(firwayarr[i].life==0)
		{
			firwayarr.splice(i,1);
		}
		else{
			if(firwayarr[i].x>0 && firwayarr[i].x <canvas.width && firwayarr[i].y>0 && firwayarr[i].y<canvas.height)
			{
				firwayarr[i].draw();
				firwayarr[i].update();
			}
			else
			{
				firwayarr.splice(i,1);
			}
		}
	}

	//console.log(firwayarr.length);


	
}

anime();
