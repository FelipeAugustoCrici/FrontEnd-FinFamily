import { FamiliesCreate, FamiliesList, FamiliesEdit } from '../';

export const FamilyRoutes = {
  family: {
    path: '/family',
    element: <FamiliesList />,
  },
  familyCreate: {
    path: '/family/create',
    element: <FamiliesCreate />,
  },
  familyUpdate: {
    path: '/family/edit/:id',
    element: <FamiliesEdit />,
    use: '/family/edit',
  },
};
