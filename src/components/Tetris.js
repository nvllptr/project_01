import React,{useState} from 'react'
import Stage from "./Stage"
import Display from "./Display"
import StartButton from "./StartButton"

import {createStage, checkCollision} from '../gameHelpers'

// Styled Components
import {StyledTetrisWrapper, StyledTetris} from "./styles/StyledTetris"

// Custom Hooks
import {usePlayer} from '../hooks/usePlayer';
import {useStage} from '../hooks/useStage';

const Tetris = () => {
    const[dropTime, setDropTime] = useState(null);
    const[gameOver, setGameOver] = useState(false);
    const[player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const[stage, setStage] = useStage(player, resetPlayer)

    const movePlayer = dir => {
        if(!checkCollision(player, stage, {x: dir, y: 0})){
            updatePlayerPos({x: dir, y:0});
        } 
    }

    const startGame = () => {
        //Reset everything
        setStage(createStage())
        resetPlayer()
        setGameOver(false)
    }   

    const drop = () => {
        if(!checkCollision(player, stage, {x: 0, y: 1})){
            updatePlayerPos({x: 0, y: 1, collided: false})
        } else {
            if(player.pos.y < 1){
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({x: 0, y: 0, collided: true});
        }
    }

    const dropPlayer = () => {
        drop();
    }

    const move = ({ keyCode }) => {
        if(!gameOver) {
            if(keyCode === 37) {
                movePlayer(-1);
            } else if (keyCode === 39){
                movePlayer(1);
            } else if (keyCode === 40){
                dropPlayer();
            } else if (keyCode === 32) {
                playerRotate(stage, 1)
            }
        }
    }

    console.log("re-render")

    return(
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)}>
            <StyledTetris>
                 <Stage stage={stage}/>
            <aside>
                {gameOver ? (
                    <Display gameOver={gameOver} text="Game Over" />
                ):(
                    <div>
                    <Display text="Score" />
                    <Display text="Rows" />
                    <Display text="Level" />
                    </div>
                )}
                <StartButton callback={startGame}/>
            </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
}

export default Tetris