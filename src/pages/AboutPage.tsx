import React, {useEffect, useRef} from 'react';

const AboutPage: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/src/pages/AboutInfo.html')
            .then(res => res.text())
            .then(html => {
                if (ref.current) {
                    ref.current.innerHTML = html;
                }
            });
    }, []);

    return (
        <div>
            <div ref={ref}/>
        </div>
    );
};

export default AboutPage;

