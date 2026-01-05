import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { InputField } from '../../components/forms/InputField';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { validation } from '../../utils/validation';
import { colors } from '../../theme/colors';

const SignupScreen = ({ navigation }: any) => {
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validateForm = () => {
        const newErrors: any = {};
        const nameValidation = validation.validateRequired(name, 'Name');
        if (!nameValidation.isValid) newErrors.name = nameValidation.error;

        const mobileValidation = validation.validateMobile(mobileNumber);
        if (!mobileValidation.isValid) newErrors.mobile = mobileValidation.error;

        const emailValidation = validation.validateEmail(email);
        if (!emailValidation.isValid) newErrors.email = emailValidation.error;

        const passwordValidation = validation.validatePassword(password);
        if (!passwordValidation.isValid) newErrors.password = passwordValidation.error;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        setApiError('');
        if (!validateForm()) return;

        setLoading(true);
        try {
            await signup({ name, mobileNumber, password, email });
            setSuccess(true);
        } catch (error: any) {
            setApiError(error.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <View style={styles.container}>
                <View style={styles.successContainer}>
                    <Text variant="headlineMedium" style={styles.successTitle}>Registration Successful!</Text>
                    <Text style={styles.successMessage}>
                        Please contact admin to get your account approved before you can log in.
                    </Text>
                    <Button mode="contained" onPress={() => navigation.navigate('Login')} style={styles.loginButton}>
                        Go to Login
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text variant="displaySmall" style={styles.title}>Create Account</Text>
                    <Text variant="titleMedium" style={styles.subtitle}>Sign up to get started</Text>
                </View>

                <Card style={styles.card}>
                    <Card.Content>
                        {apiError ? <ErrorMessage message={apiError} /> : null}
                        <InputField label="Full Name" value={name} onChangeText={setName} error={errors.name} />
                        <InputField label="Mobile Number" value={mobileNumber} onChangeText={setMobileNumber} error={errors.mobile} keyboardType="phone-pad" />
                        <InputField label="Email (Optional)" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" />
                        <InputField label="Password" value={password} onChangeText={setPassword} error={errors.password} secureTextEntry />
                        <Button mode="contained" onPress={handleSignup} loading={loading} disabled={loading} style={styles.signupButton}>
                            Sign Up
                        </Button>
                        <View style={styles.loginContainer}>
                            <Text>Already have an account? </Text>
                            <Button mode="text" onPress={() => navigation.navigate('Login')} compact>Login</Button>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 16 },
    header: { alignItems: 'center', marginBottom: 32 },
    title: { fontWeight: 'bold', color: colors.primary, marginBottom: 8 },
    subtitle: { color: colors.textSecondary },
    card: { elevation: 4 },
    signupButton: { marginTop: 16 },
    loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
    successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    successTitle: { color: colors.success, marginBottom: 16, textAlign: 'center' },
    successMessage: { textAlign: 'center', marginBottom: 24, color: colors.textSecondary },
    loginButton: { marginTop: 16 },
});

export default SignupScreen;
