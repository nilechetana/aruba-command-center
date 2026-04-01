/**
 * @file hooks/useForm.js
 * @description Custom hook for managing form field values, errors, and touched state.
 * Handles change, blur, and submit events with pluggable validation.
 * @param {Object} initialValues - Initial key-value pairs for form fields.
 * @param {Function} validateFn - Function that receives values and returns an errors object.
 * @returns {{ values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm }}
 */

import { useState, useCallback } from 'react';

const useForm = (initialValues, validateFn) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validateFn(values);
    setErrors(validationErrors);
  }, [values, validateFn]);

  const handleSubmit = useCallback((onSubmit) => (event) => {
    event.preventDefault();
    const validationErrors = validateFn(values);
    const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  }, [values, validateFn]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm };
};

export default useForm;
