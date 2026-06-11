import React from 'react';
import { render, screen } from '@testing-library/react-native';
import StatusBadge from '../StatusBadge';

describe('StatusBadge', () => {
  it('debería renderizar el estado "ABIERTO" correctamente', () => {
    render(<StatusBadge status="ABIERTO" />);

    expect(screen.getByText('ABIERTO')).toBeTruthy();
  });

  it('debería renderizar el estado "EN PROCESO" correctamente', () => {
    render(<StatusBadge status="EN PROCESO" />);

    expect(screen.getByText('EN PROCESO')).toBeTruthy();
  });

  it('debería renderizar el estado "FINALIZADO" correctamente', () => {
    render(<StatusBadge status="FINALIZADO" />);

    expect(screen.getByText('FINALIZADO')).toBeTruthy();
  });

  it('debería renderizar el estado "PENDIENTE" correctamente', () => {
    render(<StatusBadge status="PENDIENTE" />);

    expect(screen.getByText('PENDIENTE')).toBeTruthy();
  });

  it('debería aplicar diferentes colores según el estado', () => {
    const { rerender, getByText } = render(<StatusBadge status="ABIERTO" />);
    let badge = getByText('ABIERTO').parent;
    let bgColor1 = badge?.props.style.backgroundColor;

    rerender(<StatusBadge status="FINALIZADO" />);
    badge = getByText('FINALIZADO').parent;
    let bgColor2 = badge?.props.style.backgroundColor;

    expect(bgColor1).not.toBe(bgColor2);
  });
});
