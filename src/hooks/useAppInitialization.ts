import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { setAppInitialized, setLoading } from "../globals/appState/appSlice";

/**
 *  App Initialization Hook, used to handle initial loading
 */ 
const useAppInitialization = () => {
    // Redux state: While false, animation happens
    const isAppInitialized = useAppSelector((state) => state.app.isAppInitialized);
    const dispatch = useAppDispatch();
    
    // useEffect: initialize app after 1500ms
    useEffect(() => {
        const initializeApp = () => {
            dispatch(setLoading(false));
            dispatch(setAppInitialized(true));
        }
        const timer = setTimeout(initializeApp, 1500);
        return () => clearTimeout(timer);
    }, [dispatch, isAppInitialized])

    // isLoading: while true, animation happens
    const isLoading = useAppSelector((state) => state.app.isLoading);

    return { isLoading }
}

export default useAppInitialization