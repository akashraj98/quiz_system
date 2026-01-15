import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

function QuizPage() {
  const { id } = useParams();

  return (
    <Container maxWidth="md" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6">
        Quiz #{id}
      </Typography>
      {/* Quiz taking interface will be implemented in task 8 */}
    </Container>
  );
}

export default QuizPage;
