import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Button from './Button';
import { ArrowRightIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default {
  title: 'Components/Common/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'outline', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
    },
    onClick: { action: 'clicked' },
  },
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Primary Button',
  variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Secondary Button',
  variant: 'secondary',
};

export const Success = Template.bind({});
Success.args = {
  children: 'Success Button',
  variant: 'success',
};

export const Danger = Template.bind({});
Danger.args = {
  children: 'Danger Button',
  variant: 'danger',
};

export const Outline = Template.bind({});
Outline.args = {
  children: 'Outline Button',
  variant: 'outline',
};

export const Ghost = Template.bind({});
Ghost.args = {
  children: 'Ghost Button',
  variant: 'ghost',
};

export const Small = Template.bind({});
Small.args = {
  children: 'Small Button',
  size: 'sm',
};

export const Large = Template.bind({});
Large.args = {
  children: 'Large Button',
  size: 'lg',
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Disabled Button',
  disabled: true,
};

export const Loading = Template.bind({});
Loading.args = {
  children: 'Loading Button',
  loading: true,
};

export const WithLeftIcon = Template.bind({});
WithLeftIcon.args = {
  children: 'Add Item',
  icon: <PlusIcon className="h-4 w-4" />,
  iconPosition: 'left',
};

export const WithRightIcon = Template.bind({});
WithRightIcon.args = {
  children: 'Continue',
  icon: <ArrowRightIcon className="h-4 w-4" />,
  iconPosition: 'right',
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  children: 'Full Width Button',
  fullWidth: true,
};

export const IconOnly = Template.bind({});
IconOnly.args = {
  icon: <TrashIcon className="h-4 w-4" />,
  title: 'Delete item',
  'aria-label': 'Delete',
};