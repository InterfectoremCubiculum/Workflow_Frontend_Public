import { Container, Card } from 'react-bootstrap';

const HomePage = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="text-center shadow p-4" style={{ maxWidth: '600px' }}>
                <Card.Body>
                    <Card.Title as="h1" className="mb-3">Welcome to Workflow Log</Card.Title>
                    <Card.Text className="mb-4">
                        This is the main landing page of the application.
                        <br />
                        Use the navigation bar above to access features like managing worklogs, requesting time off, or viewing summaries.
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default HomePage;
