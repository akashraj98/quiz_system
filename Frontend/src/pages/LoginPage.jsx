import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await loginApi(formData.username, formData.password);
      login(response.user, response.tokens);
      navigate('/admin');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" className="py-16">
      <Paper elevation={3} className="p-8">
        <Typography variant="h4" component="h1" className="mb-6 text-center">
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert severity="error" className="mb-4">
              {errors.submit}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            className="mb-4"
            autoComplete="username"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            className="mb-6"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <LoginIcon />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>

          <Box className="mt-4 text-center">
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/signup">
                Sign up
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginPage;
