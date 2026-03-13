import { RecordsCreate, RecordsEdit, RecordsList, RecordsDetail } from '../';

export const RecordRoutes = {
  record: {
    path: '/record',
    element: <RecordsList />,
  },
  recordCreate: {
    path: '/record/create',
    element: <RecordsCreate />,
  },
  recordDetail: {
    path: '/record/detail/:id',
    element: <RecordsDetail />,
    use: '/record/detail',
  },
  recordUpdate: {
    path: '/record/edit/:id',
    element: <RecordsEdit />,
    use: '/record/edit',
  },
};
