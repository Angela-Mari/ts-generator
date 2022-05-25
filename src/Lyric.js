import './App.css';
import React from 'react';
import { Card, Tooltip, OverlayTrigger } from 'react-bootstrap';



class Lyric extends React.Component {
    constructor(props) {
        super()
        this.state = {
            keyword: props.keyword,
            album: props.album,
            songTitle: props.title,
            previous: props.previous,
            lyric: props.lyric,
            next: props.next,
            key: props.id,
            handleCopy : props.handleCopy,
            successfulCopy: false,
            show: false,
        }
        this.lyricCopy = this.lyricCopy.bind(this);

        
    }
    changeBack = () => {
        this.setState(
            prevState => {return {successfulCopy : false}}
            )
    }

    lyricCopy = () => {
        let lyric = {
            Album: this.props.album,
            Lyric: this.props.lyric
        }
        this.props.handleCopy(lyric)
        this.setState(
            prevState => {return {successfulCopy : true}}
            )
        setTimeout(this.changeBack, 1000);
    }

     render () {
         return (
        <div>
           
        
        <OverlayTrigger
        key={this.state.key}
        placement={'top'}
        overlay={
            <Tooltip id={`tooltip-copy`}>
            {   
                this.state.successfulCopy? "Coppied lyric! 💖" : "Click to copy!"
            }
        </Tooltip>
        }
        >
        <Card style={{ minWidth: '10rem', maxWidth: '18rem' }} onClick={this.lyricCopy}>
        <Card.Header as="h5">"{this.props.songTitle}"<br/><i>{this.props.album}</i></Card.Header>
            <Card.Body>
                <Card.Title></Card.Title>
                <Card.Text className="mb-2 text-muted">
                {this.props.previous}
                </Card.Text>
                <Card.Text>
                {this.props.lyric}
                </Card.Text>
                <Card.Text className="mb-2 text-muted">
                {this.props.next}
                </Card.Text>
            </Card.Body>
        </Card>
        </OverlayTrigger>
   
        </div>      
    );
    }
  }
  export default Lyric