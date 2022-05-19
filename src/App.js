import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Form, Navbar, Stack, Nav, Spinner, Row, Offcanvas} from 'react-bootstrap';
import Lyric from './Lyric';
import { useEffect, useState } from 'react';
import ts_lyrics from './taylor_swift_lyrics.csv';
// for reading the csv
import Masonry from "react-masonry-css";
import { csv } from 'd3';
import ReactGA from 'react-ga';

function App() {

  // Google Analytics
  const TRACKING_ID = "UA-175531372-2"; // YOUR_OWN_TRACKING_ID
  ReactGA.initialize(TRACKING_ID);

  const [data, setData] = useState();
  const [keywords, setKeywords] = useState("");
  var keywordsArray = []
  const [showLyrics, setShowLyrics] = useState("no");
  const [lyricCardsArray, setLyricCards] = useState([])

  
  const handleCopy = (lyric) => {
    navigator.clipboard.writeText(lyric.Lyric)    
  }
  
  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  const [validated, setValidated] = useState(false);
  const [ errors, setErrors ] = useState({})

  const findFormErrors = (keywordsArray) => {
    const newErrors = {}
    // keywords errors
    if ( keywordsArray.length < 0) {
      newErrors.keywords = 'must enter keywords'
    }
    if (keywordsArray.includes('')){
      newErrors.keywords = 'cannot search for a space'
    }
    return newErrors
  }

  function getKeywords(event){
    event.preventDefault();

    keywordsArray = keywords.split(",").map(function (value) {
      return (value.trim());
    });

    const newErrors = findFormErrors(keywordsArray)
    if ( Object.keys(newErrors).length > 0 ) {
      // We got errors!
      setErrors(newErrors)
      setValidated(false)
      setShowLyrics("no")
      return
    }
    else {
      setErrors({})
      setValidated(true)
    }

    // get lyric indecies that correspond with keyword
    let lyricsArray = findLyrics(keywordsArray)
    //shuffle
    lyricsArray = shuffle(lyricsArray)
    //send actual lyrics to Lyric component

    setLyricCards(
      lyricsArray.map((lyricIndex, index) => {
        return (<Lyric album = {data[lyricIndex]['Album']} songTitle = {data[lyricIndex]['Song']} previous = {data[lyricIndex]['Previous Lyric']} lyric = {data[lyricIndex]['Lyric']} next = {data[lyricIndex]['Next Lyric']} key = {index} handleCopy = {handleCopy}></Lyric>)
    }))
    setShowLyrics("yes") 
  }

  function findLyrics(myKeywordsArray){
    setShowLyrics("loading")
    let lyricsArray = []
    myKeywordsArray.forEach(keyword => {
      data.forEach((lyric, index) => {
        //start or end ignore case
        var regex = new RegExp("\\b" + keyword.trim().replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&') + "\\b", "i");
        if (lyric['Lyric'].match(regex)) {
          lyricsArray.push(index)
        }
      });
    });
    return lyricsArray
  }

  useEffect(()=> {
    csv(ts_lyrics).then(data => {
      setData(data)

    });
  }, [])

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  useEffect(()=> {
    ReactGA.pageview(window.location.pathname);
    } ,[])
  
  return (
    <Stack gap={3}>
          
          <Navbar 
            style={{background: "linear-gradient(to right, #50a7e0, #813c60, #ae1e4c, #a85d36, #9c9c9c, #d6b0d6, #787a6c, #7e5c43, #d9c78f)", paddingRight:"1rem"}}
            expand="lg"
            variant="dark"
          >
              <Navbar.Brand style={{color: 'white', paddingLeft:'1rem'}} >
                  <span className="nav-text">Taylor Swift </span> 
                  <span style={{color: 'white', paddingLeft:"0.5rem"}}>Caption Generator</span>                  
              </Navbar.Brand>
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} style={{marginLeft:"1rem"}}/>

            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-lg`}
              aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
              placement="end"
            >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                    More
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className='nav-color'>
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link style={{color:"white"}} href="https://www.angelageorge.me">Home</Nav.Link>
                    <Nav.Link style={{color:"white"}} href="https://github.com/Angela-Mari/ts-generator">GitHub</Nav.Link>
                    <Nav.Link style={{color:"white"}} href="https://github.com/shaynak/taylor-swift-lyrics">Lyric Source</Nav.Link>
                  </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
            
          </Navbar>
          <Container>
            Hello fellow Swifty! 
            Are you looking for the perfect lyric for your insta post? 
            Type some keywords then click generate to acheive the caption of your wildest dreams 😘
            <br/>
            Now including Red (Taylor's Version) ❤️
          </Container>
          <Container>
          <Form noValidate validated={validated}>
            <Form.Group>
            </Form.Group>
            <Form.Group className="mb-3" controlId="collectKeywords">
              <Form.Label>Input your comma seperated keywords</Form.Label>
              <Form.Control type='text' onChange = {(e) => setKeywords(e.currentTarget.value)} placeholder="blue eyes, smile, gaze" isInvalid={ !!errors.keywords }/>
              <Form.Control.Feedback type="invalid">Please input at least one keyword</Form.Control.Feedback>
            </Form.Group>
            <Button type = 'submit' onClick={(e) => getKeywords(e)}>Generate</Button>
          </Form>
          
          </Container>
          
          {
            showLyrics === "yes" ?
              lyricCardsArray.length > 0 ?
                <Container>
                    <Row>
                    <p>tap or click to copy!</p>
                    </Row>
                    <Masonry
                      breakpointCols={breakpointColumnsObj}
                      className="my-masonry-grid"
                      columnClassName="my-masonry-grid_column"
                    >
                    {lyricCardsArray}
                    </Masonry>
                </Container>
                :
                <Container>
                💔 She hasn't written a lyric with that keyword yet. Try another one!
                </Container>
              :
              showLyrics === "loading" ?
              <>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </>
              :
              <></>
          }
    </Stack>
  );
}

export default App;
