import { useCallback, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { toast } from 'react-toastify';

export interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export type ContactFormField = keyof ContactFormState;

const INITIAL_FORM_STATE: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL;

function normalizeFormState(formState: ContactFormState): ContactFormState {
  return {
    name: formState.name.trim(),
    email: formState.email.trim(),
    phone: formState.phone.trim(),
    subject: formState.subject.trim(),
    message: formState.message.trim(),
  };
}

function validateFormState(formState: ContactFormState) {
  const normalizedState = normalizeFormState(formState);

  const requiredFields: Array<keyof ContactFormState> = [
    'name',
    'email',
    'subject',
    'message',
  ];

  const missingField = requiredFields.find(
    (field) => !normalizedState[field].length,
  );

  if (missingField) {
    toast.error('Please fill in the required fields before submitting.');
    return null;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(normalizedState.email)) {
    toast.error('Enter a valid email address.');
    return null;
  }

  return normalizedState;
}

function useContactForm() {
  const [formState, setFormState] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;

      const field = name as ContactFormField;
      if (!(field in INITIAL_FORM_STATE)) {
        return;
      }

      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!CONTACT_API_URL) {
        console.error('VITE_CONTACT_API_URL is not configured.');
        toast.error('Something went wrong. Please try again later.');
        return;
      }

      const normalizedFormState = validateFormState(formState);

      if (!normalizedFormState) {
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch(CONTACT_API_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(normalizedFormState),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        toast.success("Thanks! I'll get back to you as soon as possible.");
        setFormState(INITIAL_FORM_STATE);
      } catch (error) {
        console.error('Error sending contact message', error);
        toast.error('Something went wrong. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState],
  );

  return { formState, isSubmitting, handleChange, handleSubmit };
}

export default useContactForm;
