// Category validation
export const validateCategory = (name: string, icon: string) => {
  const errors: Record<string, string> = {};
  
  if (!name.trim()) {
    errors.name = "Category name is required";
  }
  
  if (!icon.trim()) {
    errors.icon = "Category icon is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Subcategory validation
export const validateSubcategory = (name: string, categoryId: string) => {
  const errors: Record<string, string> = {};
  
  if (!name.trim()) {
    errors.name = "Subcategory name is required";
  }
  
  if (!categoryId) {
    errors.categoryId = "Please select a category";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Service validation
export const validateService = (
  id: string, 
  title: string, 
  description: string, 
  categoryId: string
) => {
  const errors: Record<string, string> = {};
  
  if (!id.trim()) {
    errors.id = "Service ID is required";
  } else if (!/^[a-z0-9-]+$/.test(id)) {
    errors.id = "Service ID should only contain lowercase letters, numbers, and hyphens";
  }
  
  if (!title.trim()) {
    errors.title = "Service title is required";
  }
  
  if (!description.trim()) {
    errors.description = "Service description is required";
  }
  
  if (!categoryId) {
    errors.categoryId = "Please select a category";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// FAQ validation
export const validateFaq = (question: string, answer: string) => {
  const errors: Record<string, string> = {};
  
  if (!question.trim()) {
    errors.question = "Question is required";
  }
  
  if (!answer.trim()) {
    errors.answer = "Answer is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Process validation
export const validateProcess = (title: string, steps: string) => {
  const errors: Record<string, string> = {};
  
  if (!title.trim()) {
    errors.title = "Process title is required";
  }
  
  if (!steps.trim()) {
    errors.steps = "At least one process step is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};