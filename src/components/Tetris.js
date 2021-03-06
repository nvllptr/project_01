import React,{useState} from 'react'
import Stage from "./Stage"
import Display from "./Display"
import StartButton from "./StartButton"
import {DOWN, LEFT, RIGHT, ROTATE, FAST_DROP} from "../utilities/constants"
import {createStage, checkCollision} from '../utilities/gameHelpers'

// Styled Components
import {StyledTetrisWrapper, StyledTetris} from "./styles/StyledTetris"

// Custom Hooks
import {useInterval} from '../hooks/useInterval'
import {usePlayer} from '../hooks/usePlayer';
import {useStage} from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus'


const Tetris = () => {
    const[dropTime, setDropTime] = useState(null);
    const[gameOver, setGameOver] = useState(false);
    const[player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const[stage, setStage, rowsCleared] = useStage(player, resetPlayer)
    const[score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared)
    
    const movePlayer = dir => {
        if(!checkCollision(player, stage, {x: dir, y: 0})){
            updatePlayerPos({x: dir, y:0});
        } 
    }

    const startGame = () => {
        //Reset everything
        setStage(createStage())
        setDropTime(1000)
        resetPlayer()
        setGameOver(false)
        setScore(0)
        setRows(0)
        setLevel(0)
    }   

    const drop = () => {
        if(rows > (level + 1) * 10) {
            setLevel(prev => prev + 1)
            setDropTime(1000/(level + 1) + 200)
        }
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

    const keyUp = ({keyCode})=> {
        if(!gameOver) {
            if(keyCode === DOWN) {
                setDropTime(1000/(level + 1) + 200)
            }
        }
    }
    const dropPlayer = () => {
        setDropTime(null)
        drop();
    }

    const fastDrop = () => {
        let y_var = 1;
        while(!checkCollision(player, stage, {x:0, y:y_var})) {
            y_var+=1;
        }
        updatePlayerPos({x: 0, y: y_var-1, collided: false})
    }

    const shadow = () => {
        let y_var = 1;
        while(!checkCollision(player, stage, {x:0, y:y_var})) {
            y_var+=1;
        }
    }

    const move = ({ keyCode }) => {
        if(!gameOver) {
            if(keyCode === LEFT) {
                movePlayer(-1);
                shadow()
            } else if (keyCode === RIGHT){
                movePlayer(1);
                shadow()
            } else if (keyCode === DOWN){
                dropPlayer();
            } else if (keyCode === ROTATE) {
                playerRotate(stage, 1)
            } else if (keyCode === FAST_DROP) {
                fastDrop()
            }
        }
    }

    useInterval(()=> {
        drop();
    }, dropTime)


    return(
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={ e => keyUp(e)}>
            <StyledTetris>
                 <Stage stage={stage}/>
            <aside>
                {gameOver ? (
                    <Display gameOver={gameOver} text="Game Over" />
                ):(
                    <div>
                    
                    </div>
                )}
                <Display text={`Score: ${score}`} />
                <Display text={`Rows: ${rows}`} />
                <Display text={`Level: ${level}`} />
                <StartButton callback={startGame}/>
            </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
}

export default Tetris