import { useState } from 'react';
import {
  Container,
  Title,
  Card,
  Text,
  Button,
  Stack,
  TextInput,
  NumberInput,
  SimpleGrid,
  Loader,
  Center,
  Alert,
  Modal,
  Group,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetEventTypesQuery, useCreateEventTypeMutation, useUpdateEventTypeMutation } from '@/api/apiSlice';
import {
  eventTypeFormSchema,
  type EventTypeFormValues,
} from '@/schemas/eventTypeFormSchema';
import type { components } from '@/api/generated-types';

type EventType = components['schemas']['EventType'];

export function AdminEventTypesPage() {
  const { data: eventTypes, isLoading } = useGetEventTypesQuery();
  const [createEventType, { isLoading: creating }] =
    useCreateEventTypeMutation();
  const [updateEventType] = useUpdateEventTypeMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EventType | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EventTypeFormValues>({
    resolver: zodResolver(eventTypeFormSchema),
  });

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    control: editControl,
    formState: { errors: editErrors },
    reset: editReset,
  } = useForm<EventTypeFormValues>({
    resolver: zodResolver(eventTypeFormSchema),
  });

  const onSubmit = async (data: EventTypeFormValues) => {
    try {
      await createEventType({
        title: data.title,
        description: data.description,
        durationMinutes: data.durationMinutes,
      }).unwrap();
      reset();
      setSubmitError(null);
    } catch {
      setSubmitError('Failed to create event type. Please try again.');
    }
  };

  const openEdit = (et: EventType) => {
    setEditing(et);
    editReset({
      title: et.title,
      description: et.description,
      durationMinutes: et.durationMinutes,
    });
    setEditError(null);
  };

  const onEditSubmit = async (data: EventTypeFormValues) => {
    if (!editing) return;
    try {
      await updateEventType({
        id: editing.id,
        title: data.title,
        description: data.description,
        durationMinutes: data.durationMinutes,
      }).unwrap();
      setEditing(null);
      setEditError(null);
    } catch {
      setEditError('Failed to update event type. Please try again.');
    }
  };

  return (
    <Container>
      <Title order={2} mb="lg">
        Event Types
      </Title>

      <Card withBorder padding="lg" mb="xl">
        <Title order={4} mb="md">
          Create Event Type
        </Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Title"
              placeholder="30 min meeting"
              {...register('title')}
              error={errors.title?.message}
            />
            <TextInput
              label="Description"
              placeholder="A quick catch-up"
              {...register('description')}
              error={errors.description?.message}
            />
            <Controller
              name="durationMinutes"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Duration (minutes)"
                  placeholder="30"
                  min={1}
                  value={field.value ?? ''}
                  onChange={(value) =>
                    field.onChange(
                      typeof value === 'string' ? parseInt(value, 10) || 0 : (value ?? 0),
                    )
                  }
                  error={errors.durationMinutes?.message}
                />
              )}
            />
            {submitError && (
              <Alert color="red" title="Error">
                {submitError}
              </Alert>
            )}
            <Button type="submit" loading={creating}>
              Create
            </Button>
          </Stack>
        </form>
      </Card>

      {isLoading ? (
        <Center h={200}>
          <Loader />
        </Center>
      ) : !eventTypes || eventTypes.length === 0 ? (
        <Text c="dimmed">No event types created yet.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {eventTypes.map((et) => (
            <Card key={et.id} withBorder padding="lg">
              <Text fw={500}>{et.title}</Text>
              <Text size="sm" c="dimmed" mt="xs" lineClamp={2}>
                {et.description}
              </Text>
              <Text size="sm" mt="sm">
                {et.durationMinutes} min
              </Text>
              <Button
                variant="light"
                size="xs"
                mt="sm"
                onClick={() => openEdit(et)}
              >
                Edit
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Modal
        opened={editing !== null}
        onClose={() => setEditing(null)}
        title="Edit Event Type"
      >
        <form onSubmit={editHandleSubmit(onEditSubmit)}>
          <Stack>
            <TextInput
              label="Title"
              placeholder="30 min meeting"
              {...editRegister('title')}
              error={editErrors.title?.message}
            />
            <TextInput
              label="Description"
              placeholder="A quick catch-up"
              {...editRegister('description')}
              error={editErrors.description?.message}
            />
            <Controller
              name="durationMinutes"
              control={editControl}
              render={({ field }) => (
                <NumberInput
                  label="Duration (minutes)"
                  placeholder="30"
                  min={1}
                  value={field.value ?? ''}
                  onChange={(value) =>
                    field.onChange(
                      typeof value === 'string' ? parseInt(value, 10) || 0 : (value ?? 0),
                    )
                  }
                  error={editErrors.durationMinutes?.message}
                />
              )}
            />
            {editError && (
              <Alert color="red" title="Error">
                {editError}
              </Alert>
            )}
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
