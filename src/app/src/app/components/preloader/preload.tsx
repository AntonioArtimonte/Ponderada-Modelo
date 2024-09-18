import { motion } from 'framer-motion';
import { slideUp, opacity } from './anim';
import { useEffect, useState } from 'react';

const words = ["Bitcoin (BTC)", "Ethereum (ETH)", "Litecoin (LTC)", "Ripple (XRP)", "Bitcoin Cash (BCH)", "Cardano (ADA)", "Polkadot (DOT)", "Dogecoin (DOGE)"];


const Preloader = () => {

    const [index, setIndex] = useState(0);
    const [dimension, setDimension] = useState({width: 0, height:0});
    
    useEffect( () => {
        setDimension({width: window.innerWidth, height: window.innerHeight})
    }, [])

    useEffect(() => {
        if (index === words.length - 1) return;
        const timer = setTimeout(() => {
            setIndex(index + 1);
        }, index === 0 ? 1000 : 150);

        return () => clearTimeout(timer);
    }, [index]);


    return (
        <motion.div
            variants={slideUp}
            initial="initial"
            animate="enter" 
            exit="exit"
            className="fixed inset-0 flex items-center justify-center bg-black"
        >
            <motion.p
                variants={opacity}
                initial="initial"
                animate="enter" 
                className="text-white text-6xl"
            >
                {words[index]}
            </motion.p>
        </motion.div>
    );
};

export default Preloader;
