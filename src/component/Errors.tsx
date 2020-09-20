import React from 'react';
import {
    Alert
}
from 'react-bootstrap';
import * as ReactRedux from 'react-redux';
import * as State from '../state';

const Errors: React.FC = () => {
    const error = ReactRedux.useSelector((state: State.RootState) => state.error);

    const dispatch = ReactRedux.useDispatch<typeof State.Store.dispatch>()

    return (
        <Alert
            className="fixed-bottom"
            show={!!error}
            dismissible={true}
            variant="danger"
            onClose={() => dispatch(State.setError(null))}>
            <Alert.Heading>
                {error?.name}
            </Alert.Heading>
            {error?.message}
        </Alert>
    );
};

export default Errors;