import React from 'react';

const ComposersList = ({composers}) => {
    return (
        <ul style={{listStyle: "none"}}>
            {composers.map( composer =>
                <li key={composer.name}>
                    {composer.name} ({composer.period[0]} - {composer.period[1]})
                </li>
            )}
        </ul>
    );
};

export default ComposersList;