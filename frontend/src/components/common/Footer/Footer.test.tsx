import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders the footer with current year', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    
    expect(screen.getByText(`© ${currentYear} TaskFlow AI. All rights reserved.`)).toBeInTheDocument();
  });

  it('displays the product links section', () => {
    render(<Footer />);
    
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Integrations')).toBeInTheDocument();
  });

  it('displays the support links section', () => {
    render(<Footer />);
    
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('displays the company links section', () => {
    render(<Footer />);
    
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Careers')).toBeInTheDocument();
  });

  it('displays social media links', () => {
    render(<Footer />);
    
    const githubLink = screen.getByLabelText('GitHub');
    const twitterLink = screen.getByLabelText('Twitter');
    
    expect(githubLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/your-username/taskflow-ai');
  });

  it('displays legal links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
  });

  it('displays the attribution text', () => {
    render(<Footer />);
    
    expect(screen.getByText(/TaskFlow AI uses AI technology/)).toBeInTheDocument();
    expect(screen.getByText(/ALX AI for Developers program/)).toBeInTheDocument();
  });

  it('has the correct brand name and description', () => {
    render(<Footer />);
    
    expect(screen.getByText('TaskFlow AI')).toBeInTheDocument();
    expect(screen.getByText(/Intelligent task management powered by AI/)).toBeInTheDocument();
  });
});