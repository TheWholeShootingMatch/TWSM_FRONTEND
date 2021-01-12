import React, {useEffect, useRef, useState} from "react";

function Canvas({toolType}){

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 566 * 2;
        canvas.height = 283 * 2;

        const context = canvas.getContext("2d");
        context.lineJoin = context.lineCap = "round";
        context.strokeStyle = "black";
        context.shadowBlur = 2
        context.lineWidth = 2;
        contextRef.current = context;
    },[])

    const startDrawing = ({nativeEvent}) => {
        if(toolType !== "drawing"){
            return;
        }
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    }

    const draw = ({nativeEvent}) => {
        if(!isDrawing){
            return;
        }
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    }

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    }

    return(
        <canvas ref={canvasRef}
        className="current_canvas"
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        width="566px" height="283px"/>
    )
}

export default Canvas;