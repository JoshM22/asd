const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')



canvas.width = 1890
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 1

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './img/hills4.png'
})

const shop = new Sprite({
	position: {
		x: 80000,
		y: 337.5
	},
	imageSrc: './img/shop1.png',
	scale: 1.3,
	framesMax: 6
})


const player = new Fighter({
	position: {
	x: 0,
	y: 0,
},
velocity: {
	x: 0,
	y: 0,
},
offset: {
	x: 0,
	y: 0
}, 

	imageSrc: './img/player1/idle.png',
	framesMax: 8,
	scale: 1.5,
	offset: {
		x: -400,
		y: -35
	},
	sprites: {
		idle: {
			imageSrc: './img/player1/idle4.png',
			framesMax: 8
		},
		run: {
			imageSrc: './img/player1/Run.png',
			framesMax: 8,
		},
		run2: {
			imageSrc: './img/player1/runleft.png',
			framesMax: 8,
		},
		jump: {
			imageSrc: './img/player1/Jump.png',
			framesMax: 3,
		},
		fall: {
			imageSrc: './img/player1/Fall.png',
			framesMax: 3,
		},
		attack1: {
			imageSrc: './img/player1/Attack1.png',
			framesMax: 7,
		},
		takeHit: {
			imageSrc: './img/player1/takehit.png',
			framesMax: 4,
		},
		death: {
			imageSrc: './img/player1/death1.png',
			framesMax: 11,
		}
	},
	attackBox: {
		offset: {
			x: -500,
			y: 50
		}, 
		width: 100,
		height: 50
	}
})



const enemy = new Fighter({
	position: {
	x: 400,
	y: 100,
},
velocity: {
	x: 0,
	y: 0,
},
color: 'violet',
offset: {
	x: -50,
	y: 0
}, 
imageSrc: './img/player2/idle2.png',
	framesMax: 8,
	scale: 1.7,
	offset: {
		x: -900,
		y: -35
	},
	sprites: {
		idle: {
			imageSrc: './img/player2/idle2.png',
			framesMax: 8,
		},
		run: {
			imageSrc: './img/player2/Run1.png',
			framesMax: 8,
		},
		run2: {
			imageSrc: './img/player2/Run.png',
			framesMax: 8,
		},
		jump: {
			imageSrc: './img/player2/Jump1.png',
			framesMax: 3,
		},
		fall: {
			imageSrc: './img/player2/Fall1.png',
			framesMax: 3,
		},
		attack1: {
			imageSrc: './img/player2/Attack5.png',
			framesMax: 7,
		},
		takeHit: {
			imageSrc: './img/player2/takehit.png',
			framesMax: 3,
		},
		death: {
			imageSrc: './img/player2/death2.png',
			framesMax: 7,
		}
	}, 

	attackBox: {
		offset: {
			x: 450,
			y: 50
		}, 
		width: 100,
		height: 50
	}
})



console.log(player)

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	w: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	}

}




decreaseTimer()

function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)

	background.update()
	shop.update()
	c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	enemy.update()

	player.velocity.x =0
	enemy.velocity.x = 0
	

	
	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5
		player.switchSprite('run2')
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5
		player.switchSprite('run')
	} else {
		player.switchSprite('idle')
	}

	if (player.velocity.y < 0) {
		player.switchSprite('jump')
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall')
	}

	//enemy movements
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5
		enemy.switchSprite('run')
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5
		enemy.switchSprite('run2')
	} else {
		enemy.switchSprite('idle')
	}

	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall')
	}


	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy
		}) &&
		player.isAttacking && player.framesCurrent === 4
		) {
		enemy.takeHit()
		player.isAttacking = false
		
		gsap.to('#enemyHP', {
      width: enemy.health + '%'
    })
  }

		

	if (player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false
	}



	if (
		rectangularCollision({
			rectangle1: enemy,
			rectangle2: player
		}) &&
		enemy.isAttacking && enemy.framesCurrent === 5
		) {
		player.takeHit()
		enemy.isAttacking = false

		gsap.to('#playerHP', {
      width: player.health + '%'
    })
  }
		


	if (enemy.isAttacking && enemy.framesCurrent === 5) {
		enemy.isAttacking = false
	}

	if (enemy.health <= 0 || player.health <= 0) {
		determinWinner({player, enemy, timerId })
	}
}

animate()

window.addEventListener('keydown', (event) => {
	if (!player.dead) {

	

	switch (event.key) {
		case 'd':
		keys.d.pressed = true
		player.lastKey = 'd'
		break
		case 'a':
		keys.a.pressed = true
		player.lastKey = 'a'
		break
		case 'w':
		player.velocity.y = -20
		break
		case ' ':
		player.attack()
		break

	}
}
	
	if ( !enemy.dead) {


	switch(event.key) {
		case 'ArrowRight':
		keys.ArrowRight.pressed = true
		enemy.lastKey = 'ArrowRight'
		break
		case 'ArrowLeft':
		keys.ArrowLeft.pressed = true
		enemy.lastKey = 'ArrowLeft'
		break
		case 'ArrowUp':
		enemy.velocity.y = -20
		break
		case 'ArrowDown':
		enemy.attack()
		break
	}
}
})

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd':
		keys.d.pressed = false
		break
		case 'a':
		keys.a.pressed = false
		break
		case 'w':
		keys.w.pressed = false
		break
	}
 
 //enemy keys
	switch (event.key) {
		case 'ArrowRight':
		keys.ArrowRight.pressed = false
		break
		case 'ArrowLeft':
		keys.ArrowLeft.pressed = false
		break
		
	}
	
})