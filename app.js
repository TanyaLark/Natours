const fs = require('fs');
const express = require('express');

const app = express();

// Middlewares
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from server side!', app: 'Natours' });
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return req.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  for (const prop in req.body) {
    if (prop in tour) {
      tour[prop] = req.body[prop];
    }
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return req.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  const tourIndex = tours.findIndex((el) => el.id === id);
  tours.splice(tourIndex, 1);

  res.status(204).json({
    status: 'Success',
  });
};

app.route('/api/v1/tours').get(getTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
