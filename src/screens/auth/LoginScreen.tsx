import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { InputField } from '../../components/forms/InputField';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { validation } from '../../utils/validation';
import { colors } from '../../theme/colors';

const LoginScreen = ({ navigation }: any) => {
    const { login } = useAuth();
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors: any = {};

        const mobileValidation = validation.validateMobile(mobileNumber);
        if (!mobileValidation.isValid) {
            newErrors.mobile = mobileValidation.error;
        }

        const passwordValidation = validation.validatePassword(password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.error;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        setApiError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await login({ mobileNumber, password });
            // Navigation is handled automatically by AuthContext/AppNavigator
        } catch (error: any) {
            console.error('Login error:', error);
            setApiError(
                error.response?.data?.message || 'Login failed. Please check your credentials.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text variant="displaySmall" style={styles.title}>
                        Campus Placement
                    </Text>
                    <Text variant="titleMedium" style={styles.subtitle}>
                        Login to your account
                    </Text>
                </View>

                <Card style={styles.card}>
                    <Card.Content>
                        {apiError ? <ErrorMessage message={apiError} /> : null}

                        <InputField
                            label="Mobile Number"
                            value={mobileNumber}
                            onChangeText={setMobileNumber}
                            error={errors.mobile}
                            keyboardType="phone-pad"
                            placeholder="Enter 10-digit mobile number"
                        />

                        <InputField
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            error={errors.password}
                            secureTextEntry
                            placeholder="Enter your password"
                        />

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            loading={loading}
                            disabled={loading}
                            style={styles.loginButton}>
                            Login
                        </Button>

                        <Button
                            mode="text"
                            onPress={() => navigation.navigate('ForgotPassword')}
                            style={styles.forgotButton}>
                            Forgot Password?
                        </Button>

                        <View style={styles.signupContainer}>
                            <Text>Don't have an account? </Text>
                            <Button
                                mode="text"
                                onPress={() => navigation.navigate('Signup')}
                                compact>
                                Sign Up
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        color: colors.textSecondary,
    },
    card: {
        elevation: 4,
    },
    loginButton: {
        marginTop: 16,
        marginBottom: 8,
    },
    forgotButton: {
        marginTop: 8,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
});

export default LoginScreen;
