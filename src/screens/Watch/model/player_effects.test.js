import playerEffects from './player_effects';


describe('player effects', () => {
    const runEffect = (effect, mockState) => {
      const generator = effect(null, {
        select: () => mockState,
        put: action => action
      });
      
      generator.next();  // First yield (select) - initial value
      return generator.next(mockState).value;  // Second yield (put) - value after effect
    };
  
    describe('media_volumeDown', () => {
      it('should decrease volume by 0.05 and not go below 0', () => {
        const result = runEffect(
          playerEffects.media_volumeDown, 
          { playerpref: { volume: 0.5 } }
        );
        
        expect(result).toEqual({
          type: 'watch/media_volume',
          payload: 0.45
        });
      });
  
      it('should not decrease volume below 0', () => {
        const result = runEffect(
          playerEffects.media_volumeDown, 
          { playerpref: { volume: 0.02 } }
        );
        
        expect(result).toEqual({
          type: 'watch/media_volume',
          payload: 0
        });
      });
    });
  });