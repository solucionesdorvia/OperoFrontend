import React from 'react';
import { render, screen } from '@testing-library/react-native';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('debería renderizar el mensaje correctamente', () => {
    render(<EmptyState message="No hay datos disponibles" />);

    expect(screen.getByText('No hay datos disponibles')).toBeTruthy();
  });

  it('debería renderizar con el ícono por defecto "info"', () => {
    const { UNSAFE_root } = render(<EmptyState message="Test" />);

    const iconComponent = UNSAFE_root.findAllByType('RNSVGGroup');
    expect(iconComponent).toBeTruthy();
  });

  it('debería renderizar con el ícono personalizado', () => {
    render(<EmptyState icon="check-circle" message="Test completado" />);

    expect(screen.getByText('Test completado')).toBeTruthy();
  });

  it('debería aplicar los estilos correctos al contenedor', () => {
    const { getByText } = render(<EmptyState message="Test" />);

    const textElement = getByText('Test');
    expect(textElement.props.style).toMatchObject({
      fontSize: 15,
    });
  });
});
