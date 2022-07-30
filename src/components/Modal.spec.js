import React from 'react';
import { render, screen } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  describe('Layout', () => {
    it('will be visible when visible property set to true', () => {
      render(<Modal visible={true} />);
      // Se usa queryByTestId porque el contenido será dinámico y no se puede hacer query basado
      // en algo visible en la página
      const modalRootDiv = screen.queryByTestId('modal-root');
      expect(modalRootDiv).toHaveClass('modal fade d-block show');
      expect(modalRootDiv).toHaveStyle(`background-color: #000000b0`);
    });

    it('displays the title provided as prop', () => {
      render(<Modal title="Test Title" />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('displays the body provided as prop', () => {
      render(<Modal body="Test Body" />);
      expect(screen.getByText('Test Body')).toBeInTheDocument();
    });

    it('displays OK button text provided as prop', () => {
      render(<Modal okButton="OK" />);
      expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('displays Cancel button text provided as prop', () => {
      render(<Modal cancelButton="Cancel" />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('displays defaults for buttons when corresponding props not provided', () => {
      render(<Modal />);
      expect(screen.getByText('Ok')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });
});
