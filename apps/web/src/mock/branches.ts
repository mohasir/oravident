export interface Branch {
  id: string;
  name: string;
  address: string;
}

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 'branch-1',
    name: 'Sucursal Centro',
    address: 'Av. Juárez 120, Col. Centro',
  },
  {
    id: 'branch-2',
    name: 'Sucursal Norte',
    address: 'Blvd. Insurgentes 450, Col. Linda Vista',
  },
  {
    id: 'branch-3',
    name: 'Sucursal Sur',
    address: 'Calle Olivos 88, Col. Del Valle',
  },
  {
    id: 'branch-4',
    name: 'Sucursal Poniente',
    address: 'Av. Las Américas 310, Col. Jardines',
  },
];
