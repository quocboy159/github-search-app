import React from 'react';
import { useMutation } from '@apollo/client';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { CREATE_ISSUE } from '../graphql/mutations';
import { toast } from 'react-toastify';

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  repositoryId: string;
  userName: string;
  onSuccess: (metadata: any) => void;
}

interface IssueFormInputs {
  title: string;
  body: string;
}

const IssueModal: React.FC<IssueModalProps> = ({
  isOpen,
  onClose,
  repositoryId,
  userName,
  onSuccess
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IssueFormInputs>();
  const [createIssue] = useMutation(CREATE_ISSUE);

  const onSubmit = async (data: IssueFormInputs) => {
    try {
      await createIssue({
        variables: {
          repositoryId,
          title: data.title,
          body: data.body
        }
      });
      toast.success('Issue created successfully!');
      onClose();
      reset();
      onSuccess(userName);
    } catch (error) {
      console.error('Error creating issue:', error);
      toast.error('Failed to create issue. Please try again.');
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Issue</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group controlId="issueTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Issue Title"
              {...register('title', { required: 'Title is required' })}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="issueBody">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Issue Description"
              {...register('body', { required: 'Description is required' })}
              isInvalid={!!errors.body}
            />
            <Form.Control.Feedback type="invalid">{errors.body?.message}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Issue
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default IssueModal;
