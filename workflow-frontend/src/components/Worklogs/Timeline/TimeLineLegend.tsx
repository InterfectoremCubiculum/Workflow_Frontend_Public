import { Card, Row, Col, Badge } from 'react-bootstrap';

const TimeLineLegend: React.FC = () => (
  <Card className="mb-3" style={{ maxWidth: 400 }}>
    <Card.Body>
      <Card.Title>Legends</Card.Title>
      <Row className="align-items-center mb-2">
        <Col xs="auto">
          <Badge bg="success" style={{ width: 20, height: 20 }}>&nbsp;</Badge>
        </Col>
        <Col>Active time segment</Col>
      </Row>
      <Row className="align-items-center mb-2">
        <Col xs="auto">
          <Badge bg="danger" style={{ width: 20, height: 20 }}>&nbsp;</Badge>
        </Col>
        <Col>Break</Col>
      </Row>
      <Row className="align-items-center mb-2">
        <Col xs="auto">
          <Badge bg="warning" style={{ width: 20, height: 20 }}>&nbsp;</Badge>
        </Col>
        <Col>Ongoing segment (no end)</Col>
      </Row>
    </Card.Body>
  </Card>
);

export default TimeLineLegend;