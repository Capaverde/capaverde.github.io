(define (naturals)
	(define n 0)
	(lambda () (begin (set! n (+ n 1)) n)))

(define nat1 (naturals))
(define nat2 (naturals))

(display (nat1))
(display (nat2))
(display (nat1))
(display (nat2))
(display (nat1))
(display (nat1))
(display (nat2))
(display (nat2))

;derivada numérica
;integração numérica
;resolvedor de equações (simbólico)
;derivada simbólica
;integração simbólica
(newline)

(define (deriv-num f x dx) (/ (- (f (+ x dx)) (f x)) dx))
(define (square x) (* x x))
(display (deriv-num square 0 0.0001))


;operações com vetores
(define (makevec x y z) (list x y z))
(define (xvec v) (car v))
(define (yvec v) (cadr v))
(define (zvec v) (caddr v))
(define (addvec v1 v2)
	(makevec (+ (xvec v1) (xvec v2))
		 (+ (yvec v1) (yvec v2))
		 (+ (zvec v1) (zvec v2))))
(define (scalevec c v)
	(makevec (* c (xvec v))
		 (* c (yvec v))
		 (* c (zvec v))))
(define (subvec v1 v2)
	(addvec v1 (scalevec -1 v2)))
(define (dotvec v1 v2)
	(+ (* (xvec v1) (xvec v2))
	   (* (yvec v1) (yvec v2))
	   (* (zvec v1) (zvec v2))))
(define (magvec v) (sqrt (dotvec v v)))
(define (unitvec v)
	(scalevec (/ 1 (magvec v)) v))
(define (crossvec v1 v2)
	(makevec (- (* (yvec v1) (zvec v2)) (* (zvec v1) (yvec v2)))
		 (- (* (zvec v1) (xvec v2)) (* (xvec v1) (zvec v2)))
		 (- (* (xvec v1) (yvec v2)) (* (yvec v1) (xvec v2))) ))


;gira vetor em torno de vetor por theta rad
(define (gira v0 eixo theta)
	(let* ((eixo (unitvec eixo)) (h (scalevec (dotvec v0 eixo) eixo)) 
		(vx (subvec v0 h)) (vy (crossvec eixo vx))
		(vres (addvec h (addvec (scalevec (cos theta) vx) (scalevec (sin theta) vy)))) )
		vres))

(define pi (* 4 (atan 1)))
(display (gira (makevec 1 1 1) (makevec 0 2 1) 1))
