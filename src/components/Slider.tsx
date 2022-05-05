import { SunIcon } from "@heroicons/react/solid";
import { motion, useMotionValue, useDragControls } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const Slider = () => {
  const [value, setValue] = useState(0.5);
  const x = useMotionValue(0);
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);
  const sliderRailRef = useRef<HTMLDivElement | null>(null);
  const sliderKnobRef = useRef<HTMLDivElement | null>(null);
  const dragControls = useDragControls();

  const valueRef = useRef<number>(value);

  // calculates the width of the slider from percentage
  const sliderWidth = `calc(${value} * (100% - 20px) + 20px)`;

  // translate the slider knob to the correct position (only on mount)
  useLayoutEffect(() => {
    console.log("initial");

    // get max width of slider track
    const sliderWidth = sliderTrackRef.current!.offsetWidth - 20;

    const translateX = valueRef.current * sliderWidth;

    sliderKnobRef.current!.style.left = `${translateX}px`;

    // x.set(translateX);
  }, [x]);

  useEffect(() => {
    x.onChange((latest) => {
      console.log("Yo");
      const sliderTrack = sliderTrackRef.current!;
      // get the maximum width the slider rail could be
      const maxWidth = sliderTrack.offsetWidth - 20;
      console.log({ maxWidth });

      // get the change in x
      // calculate new percentage
      const newPercentage = latest / maxWidth;
      // normalize percentages
      const normalizedPercentage = Math.max(Math.min(newPercentage, 1), 0);
      console.log({ normalizedPercentage });
      // update percentage
      setValue(normalizedPercentage);
    });
  }, [x]);

  console.log(value);
  console.log(sliderWidth);

  return (
    <div
      ref={sliderTrackRef}
      className="slider__track"
      onMouseDown={(e) => {
        console.log("on mouse down");
        console.log(e.clientX);

        // const sliderTrack = sliderTrackRef.current!;

        // const boundingRect = sliderTrack.getBoundingClientRect();
        // const left = boundingRect.left;

        // const amountTranslated = e.clientX - left;

        // console.log({ amountTranslated });

        // // get the maximum width the slider rail could be
        // const maxWidth = sliderTrack.offsetWidth - 20;

        // // refactor this shit later

        // // calculate new percentage
        // const newPercentage = (amountTranslated - 10) / maxWidth;

        // // normalize percentages
        // const normalizedPercentage = Math.max(Math.min(newPercentage, 1), 0);

        // console.log({ normalizedPercentage });

        // x.set(amountTranslated - 10);
        // setValue(normalizedPercentage);

        x.set(0);

        dragControls.start(e, { snapToCursor: true });
      }}
    >
      {/* <SunIcon className="slider__icon" /> */}
      <div
        ref={sliderRailRef}
        className="slider__rail"
        style={{ width: sliderWidth }}
      >
        <motion.div className="slider__knob" />
        <motion.div
          ref={sliderKnobRef}
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0}
          className="knob__placeholder"
          drag="x"
          whileTap={{
            backgroundColor: "#F0F0F0",
            transition: {
              duration: 0.15,
            },
          }}
          onDragStart={(event, info) => {
            // console.log(event, info);
            // isAnimatingRef.current = true;
            // const sliderRail = sliderRailRef.current!;
            // // get the current width of the slider rail
            // const currentWidth = sliderRail.offsetWidth - 20;
            // console.log({ currentWidth });
            // if (!initialPositionRef.current) {
            //   initialPositionRef.current = { width: currentWidth };
            // }
          }}
          onDragEnd={(event, info) => {
            // console.log(sliderKnobRef.current!.style.left);
            // x.set(0);
            // sliderKnobRef.current!.style.left = sliderWidth;
          }}
          //   onAnimationComplete={() => console.log("animation complete")}

          //   onDrag={(event, info) => console.log(info)}
          style={{ x }}
        />
      </div>
    </div>
  );
};
