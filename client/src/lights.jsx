import { Slider } from '@mui/material';
import { useState } from "react"

const api = require("./api")

const Lights = (props) => {

    const [slider_value, set_slider_value] = useState(50)

    const handle_switch = (method) => {
        set_slider_value(50)
        api.light_switch(method)
    }

    const handle_slider = (value) => {
        set_slider_value(value.target.value)
        api.light_dimmer(value.target.value)
    }

    return (
        <div className="main">
            <div className="switch_container">
                <button className="on" onClick={() => { handle_switch(true) }} />
                <button className="off" onClick={() => { handle_switch(false) }} />
            </div>
            <div className="slider_container">
                <Slider
                    orientation="vertical"
                    defaultValue={slider_value}
                    value={slider_value}
                    aria-label="Temperature"
                    valueLabelDisplay="auto"
                    className="slider"
                    sx={{
                        background_color: "white",
                        '& .MuiSlider-thumb': {
                            borderRadius: '1px',
                        },
                    }}
                    onChange={handle_slider}
                />
            </div>
        </div>
    )
}

export default Lights