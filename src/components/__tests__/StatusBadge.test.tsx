import React from 'react';
import { render, screen } from '@testing-library/react-native';
import StatusBadge from '../StatusBadge';

describe('StatusBadge', () => {
  it('debería renderizar el estado "ABIERTO" correctamente', () => {
    render(<StatusBadge status="ABIERTO" />);

    expect(screen.getByText('Abierto')).toBeTruthy();
  });

  it('debería renderizar el estado "EN PROCESO" correctamente', () => {
    render(<StatusBadge status="EN PROCESO" />);

    expect(screen.getByText('En proceso')).toBeTruthy();
  });

  it('debería renderizar el estado "FINALIZADO" correctamente', () => {
    render(<StatusBadge status="FINALIZADO" />);

    expect(screen.getByText('Finalizado')).toBeTruthy();
  });

  it('debería renderizar el estado "PENDIENTE" correctamente', () => {
    render(<StatusBadge status="PENDIENTE" />);

    expect(screen.getByText('Pendiente')).toBeTruthy();
  });

  it('debería renderizar correctamente con diferentes estados', () => {
    const { rerender } = render(<StatusBadge status="ABIERTO" />);
    expect(screen.getByText('Abierto')).toBeTruthy();

    rerender(<StatusBadge status="FINALIZADO" />);
    expect(screen.getByText('Finalizado')).toBeTruthy();
  });
});
