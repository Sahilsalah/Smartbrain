import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import 'tachyons'
import Clarifai from 'clarifai'
import Particles from 'react-particles-js';

const app = new Clarifai.App({
 apiKey: '9f2f849619254403bfc8bce1a9e259f8'
});


const particlesOptions={
  
    particles: {
      number:{
        Value:30,
        density:{
          enable:true,
          value_area:800
        
               }
           }
        }
}
class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box:{},
    }
  }

  calculateFace=(data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height= Number(image.height);
    return{
      leftCol: clarifaiFace.left_col *width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row *height)
    }
  }

displayFaces=(box)=>{
  console.log(box);
  this.setState({box:box});
}


  onInputChange=(event)=> {
    this.setState({input:event.target.value});
  }

  onSubmit=()=>{
    this.setState({imageUrl:this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
    .then(response =>this.displayFaces(this.calculateFace(response)))
    .catch(err=>console.log(err));
    
      
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}/>
        <Navigation/>
        <Logo/>
        <Rank/>
        <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>

      
    
      </div>
    );
  }
}

export default App;
