export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createStage = () =>
    Array.from(Array(STAGE_HEIGHT), () =>
        new Array(STAGE_WIDTH).fill([0, 'clear'])
    )

export const checkCollision = (player, stage, { x: moveX, y: moveY}) => {
    for(let y = 0; y < player.tetromino.length; y += 1){
        for(let x = 0; x < player.tetromino[y].length; x +=1) {
            if(player.tetromino[y][x] !== 0){
                if (
                    // Check that the move is inside the game area height (y)
                    !stage[y + player.pos.y + moveY] ||

                    // Check that the move is inside the game area width (x)
                    !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||

                    // Check that the cell we're moving to isn't clear
                    stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
                ) {
                    return true;
                }
                
                
            }
        }
    }
}
