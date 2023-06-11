import React, { Component } from 'react';
import myAudio from '../Assets/myAudio.mp3';
import mySecondAudio from '../Assets/job.mp3';

class PomodoroTimer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        time: 0,
        initialTime: 0,
        isRunning: false,
        hasEnded: false, // New state variable to track countdown end
        warningMessage: '',
        };
        this.warningAudio = new Audio(myAudio);
        this.secondAudio = new Audio(mySecondAudio);
    }

    componentDidMount() {
        // Add event listener to handle warning audio playback
        this.warningAudio.addEventListener('ended', () => {
        this.setState({ hasEnded: false });
        });

        // Add event listener to handle second audio playback 👂
        this.secondAudio.addEventListener('ended', () => {
        this.setState({ hasEnded: false });
        });
    }

    componentWillUnmount() {
        // Clear the interval when the component is unmounted 🗑️
        clearInterval(this.timerInterval);
    }

    tick = () => {
        if (this.state.isRunning && this.state.time > 0) {
        // Decrease the time by 1 second if the timer is running and time is not zero 🙂
        this.setState((prevState) => ({ time: prevState.time - 1 }));
        } else if (this.state.time === 0) {
        // If the time reaches zero, clear the interval, set isRunning to false, and trigger the warning sound ♻️
        clearInterval(this.timerInterval);
        this.setState({ isRunning: false, hasEnded: true }); // Set hasEnded to true
        }
    };

    startTimer = () => {
        const { time, isRunning } = this.state;

        if (time === 0) {
        // If time is zero, display a warning message and return ⚠️
        this.setState({ warningMessage: 'Set your desired time or choose 15 <-> 25 min' });
        setTimeout(() => {
            this.setState({ warningMessage: '' });
        }, 3000);
        return;
        }

        if (isRunning) {
        // If the timer is running, clear the interval to pause the timer ♻️
        clearInterval(this.timerInterval);
        } else {
        // If the timer is not running, start the timer by setting the interval 😎
        this.timerInterval = setInterval(this.tick, 1000);
        }

        // Toggle the isRunning state ✨
        this.setState((prevState) => ({
        isRunning: !prevState.isRunning,
        hasEnded: false, // Reset hasEnded to false when starting the timer
        }));
    };

    stopTimer = () => {
        // Clear the interval and reset the state to stop the timer ♻️
        clearInterval(this.timerInterval);
        this.setState({ time: 0, initialTime: 0, isRunning: false });
    };

    handleTimeChange = (event) => {
        // Update the time state based on the input value 😉
        const inputTime = parseInt(event.target.value, 10);
        this.setState({ time: inputTime * 60, initialTime: inputTime * 60 });
    };

    formatTime = (time) => {
        // Format the time as minutes and seconds 😐
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
    };

    handlePresetTime = (minutes) => {
        // Set the time state based on the preset minutes and start the timer ⏲️
        const timeInSeconds = minutes * 60;
        this.setState({ time: timeInSeconds, initialTime: timeInSeconds, isRunning: true }, () => {
        this.timerInterval = setInterval(this.tick, 1000);
        });
    };

    render() {
        const { time, isRunning, warningMessage, hasEnded } = this.state;
        const inputValue = (time / 60).toFixed();

        return (
        <div className="px-4 py-5 my-5 text-center">
            <div className="container">
            {/* Check if the countdown has ended, then play the audio */}
            {hasEnded && (
                <div>
                <audio src={myAudio} autoPlay />
                <audio src={mySecondAudio} autoPlay />
                </div>
            )}
            <h2 className="Timer">{this.formatTime(time)}</h2>
            <div className="WarningBox">
                {warningMessage && <p className="lead warningMessage fs-3">{warningMessage}</p>}
            </div>
            {!isRunning && (
                <div className="d-flex flex-column col-sm-2 mx-auto">
                <input
                    className="w-50 form-control form-control-lg mx-auto myInput"
                    type="number"
                    min="1"
                    max="60"
                    value={inputValue}
                    onChange={this.handleTimeChange}
                />
                <div className="btn-group mt-3">
                    <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => this.handlePresetTime(15)}
                    >
                    15 min
                    </button>
                    <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => this.handlePresetTime(25)}
                    >
                    25 min
                    </button>
                </div>
                </div>
            )}
            <div className="mt-3 btn-group">
                <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={this.startTimer}
                >
                {isRunning ? <i className="bi bi-pause-fill fs-3"></i> : <i className="bi bi-play-fill fs-3"></i>}
                </button>
                <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={this.stopTimer}
                >
                <i className="bi bi-stop-fill fs-3"></i>
                </button>
            </div>
            </div>
        </div>
        );
    }
}

export default PomodoroTimer;
