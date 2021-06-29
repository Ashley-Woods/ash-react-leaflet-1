// src/compoents/App.js
import React from 'react';
import Map from './Map';
import InfoPanel from './InfoPanel';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../styles/App.css';

export default function App() {
  return (
    <div className="App">
      <header>
        <h3>Ash - React Leaflet Map</h3>
      </header>
      <Container>
        <Row>
          <Col>
            <Map />
          </Col>
          <Col xs lg="2">
            <InfoPanel />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
